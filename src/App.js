import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { fetchModules } from './store/moduleSlice';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import ChapterPage from './pages/ChapterPage';
import QuestionPage from './pages/QuestionPage';
import ProgressPage from './pages/ProgressPage';
import MathTest from './components/MathTest';

function App() {
  const dispatch = useDispatch();

  // Load modules when the app starts
  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/subjects/:subjectId" element={<SubjectPage />} />
      <Route path="/subjects/:subjectId/chapters/:chapterId" element={<ChapterPage />} />
      <Route path="/subjects/:subjectId/chapters/:chapterId/questions/:questionId" element={<QuestionPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/math-test" element={<MathTest />} />
      
      {/* Legacy routes for compatibility */}
      <Route path="/module/:subjectId" element={<Navigate to="/subjects/:subjectId" replace />} />
      <Route path="/module/:subjectId/chapter/:chapterId" element={<Navigate to="/subjects/:subjectId/chapters/:chapterId" replace />} />
      <Route path="/module/:subjectId/chapter/:chapterId/question/:questionId" element={<Navigate to="/subjects/:subjectId/chapters/:chapterId/questions/:questionId" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
