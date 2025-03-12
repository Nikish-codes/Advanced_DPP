import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectPage from './pages/SubjectPage';
import ChapterPage from './pages/ChapterPage';
import QuestionPage from './pages/QuestionPage';
import ProgressPage from './pages/ProgressPage';
import BookmarksPage from './pages/BookmarksPage';
import MathTest from './components/MathTest';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/subjects" element={<SubjectsPage />} />
      <Route path="/:subjectName" element={<SubjectPage />} />
      <Route path="/:subjectName/:chapterName" element={<ChapterPage />} />
      <Route path="/:subjectName/:chapterName/:questionNumber" element={<QuestionPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/bookmarks" element={<BookmarksPage />} />
      <Route path="/math-test" element={<MathTest />} />
      
      {/* Legacy routes for compatibility */}
      <Route path="/subjects/:subjectId" element={<Navigate to="/:subjectName" replace />} />
      <Route path="/subjects/:subjectId/chapters/:chapterId" element={<Navigate to="/:subjectName/:chapterName" replace />} />
      <Route path="/subjects/:subjectId/chapters/:chapterId/questions/:questionId" element={<Navigate to="/:subjectName/:chapterName/:questionNumber" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
