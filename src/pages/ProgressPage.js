import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchModules } from '../store/moduleSlice';
import { getAttemptedQuestions, clearUserProgress } from '../utils/localStorage';
import Layout from '../components/Layout';

const ProgressPage = () => {
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.modules);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    byModule: {},
    byLevel: {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
    },
  });
  
  useEffect(() => {
    // Fetch modules if not already loaded
    if (modules.length === 0) {
      dispatch(fetchModules());
    }
    
    // Get attempted questions from localStorage
    const attempted = getAttemptedQuestions();
    setAttemptedQuestions(attempted);
    
    // Calculate statistics
    calculateStats(attempted);
  }, [dispatch, modules]);
  
  // Calculate statistics based on attempted questions
  const calculateStats = (attempted) => {
    // This is a placeholder. In a real app, we would fetch question details
    // to calculate accurate statistics by module, level, etc.
    const questionIds = Object.keys(attempted);
    const total = questionIds.length;
    const correct = questionIds.filter(id => attempted[id].isCorrect).length;
    
    setStats({
      total,
      correct,
      incorrect: total - correct,
      byModule: {
        physics: { total: Math.floor(total * 0.4), correct: Math.floor(correct * 0.4) },
        chemistry: { total: Math.floor(total * 0.3), correct: Math.floor(correct * 0.3) },
        mathematics: { total: Math.floor(total * 0.3), correct: Math.floor(correct * 0.3) },
      },
      byLevel: {
        1: { total: Math.floor(total * 0.5), correct: Math.floor(correct * 0.5) },
        2: { total: Math.floor(total * 0.3), correct: Math.floor(correct * 0.3) },
        3: { total: Math.floor(total * 0.2), correct: Math.floor(correct * 0.2) },
      },
    });
  };
  
  // Handle clearing user progress
  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all your progress? This action cannot be undone.')) {
      clearUserProgress();
      setAttemptedQuestions({});
      setStats({
        total: 0,
        correct: 0,
        incorrect: 0,
        byModule: {},
        byLevel: {
          1: { total: 0, correct: 0 },
          2: { total: 0, correct: 0 },
          3: { total: 0, correct: 0 },
        },
      });
    }
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-text-secondary">
          Track your performance and identify areas for improvement.
        </p>
      </div>
      
      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2">Total Questions Attempted</h2>
          <p className="text-4xl font-bold text-accent">{stats.total}</p>
        </div>
        
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2">Correct Answers</h2>
          <p className="text-4xl font-bold text-success">{stats.correct}</p>
          <p className="text-text-secondary text-sm mt-2">
            {stats.total > 0 ? `${Math.round((stats.correct / stats.total) * 100)}% accuracy` : 'No questions attempted'}
          </p>
        </div>
        
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2">Incorrect Answers</h2>
          <p className="text-4xl font-bold text-error">{stats.incorrect}</p>
        </div>
      </div>
      
      {/* Progress by Module */}
      <h2 className="text-2xl font-bold mb-4">Progress by Subject</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {modules.map((module) => {
          const moduleStats = stats.byModule[module.id] || { total: 0, correct: 0 };
          const accuracy = moduleStats.total > 0 ? (moduleStats.correct / moduleStats.total) * 100 : 0;
          
          return (
            <div className="card" key={module.id}>
              <h3 className="text-lg font-semibold text-accent mb-2">{module.title}</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-text-secondary text-sm">Accuracy</span>
                  <span className="text-text-secondary text-sm">{Math.round(accuracy)}%</span>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-2">
                  <div 
                    className="bg-accent rounded-full h-2" 
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Attempted: {moduleStats.total}</span>
                <span className="text-text-secondary">Correct: {moduleStats.correct}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress by Difficulty Level */}
      <h2 className="text-2xl font-bold mb-4">Progress by Difficulty Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((level) => {
          const levelStats = stats.byLevel[level] || { total: 0, correct: 0 };
          const accuracy = levelStats.total > 0 ? (levelStats.correct / levelStats.total) * 100 : 0;
          const levelColors = {
            1: 'bg-success',
            2: 'bg-warning',
            3: 'bg-error',
          };
          
          return (
            <div className="card" key={level}>
              <h3 className="text-lg font-semibold mb-2">
                Level {level}
                <span className={`ml-2 inline-block w-3 h-3 rounded-full ${levelColors[level]}`}></span>
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-text-secondary text-sm">Accuracy</span>
                  <span className="text-text-secondary text-sm">{Math.round(accuracy)}%</span>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-2">
                  <div 
                    className={`${levelColors[level]} rounded-full h-2`} 
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Attempted: {levelStats.total}</span>
                <span className="text-text-secondary">Correct: {levelStats.correct}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recently Attempted Questions */}
      <h2 className="text-2xl font-bold mb-4">Recently Attempted Questions</h2>
      {Object.keys(attemptedQuestions).length === 0 ? (
        <div className="card">
          <p className="text-text-secondary">You haven't attempted any questions yet.</p>
          <div className="mt-4">
            <Link to="/" className="button">
              Start Practicing
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="card">
            <p className="text-text-secondary mb-4">
              You have attempted {Object.keys(attemptedQuestions).length} questions.
            </p>
            <div className="flex justify-end">
              <button className="button danger" onClick={handleClearProgress}>
                Clear Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProgressPage; 