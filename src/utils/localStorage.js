const STORAGE_KEY = 'jee_adv_progress';

/**
 * Get user progress from localStorage
 * @returns {Object} User progress object
 */
export const getUserProgress = () => {
  try {
    const progressData = localStorage.getItem(STORAGE_KEY);
    return progressData ? JSON.parse(progressData) : {
      attemptedQuestions: {},
      savedAnswers: {}
    };
  } catch (error) {
    console.error('Error getting user progress from localStorage:', error);
    return {
      attemptedQuestions: {},
      savedAnswers: {}
    };
  }
};

/**
 * Save user progress to localStorage
 * @param {Object} progressData - User progress data to save
 */
export const saveUserProgress = (progressData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving user progress to localStorage:', error);
  }
};

/**
 * Mark a question as attempted
 * @param {string} questionId - The ID of the question
 * @param {boolean} isCorrect - Whether the answer was correct
 */
export const markQuestionAttempted = (questionId, isCorrect) => {
  try {
    const progressData = getUserProgress();
    
    progressData.attemptedQuestions[questionId] = {
      isCorrect,
      timestamp: Date.now()
    };
    
    saveUserProgress(progressData);
  } catch (error) {
    console.error('Error marking question as attempted:', error);
  }
};

/**
 * Save user's answer for a question
 * @param {string} questionId - The ID of the question
 * @param {any} answer - The user's answer
 */
export const saveUserAnswer = (questionId, answer) => {
  try {
    const progressData = getUserProgress();
    
    progressData.savedAnswers[questionId] = {
      answer,
      timestamp: Date.now()
    };
    
    saveUserProgress(progressData);
  } catch (error) {
    console.error('Error saving user answer:', error);
  }
};

/**
 * Check if a question has been attempted
 * @param {string} questionId - The ID of the question
 * @returns {boolean} Whether the question has been attempted
 */
export const isQuestionAttempted = (questionId) => {
  try {
    const progressData = getUserProgress();
    return !!progressData.attemptedQuestions[questionId];
  } catch (error) {
    console.error('Error checking if question is attempted:', error);
    return false;
  }
};

/**
 * Get user's answer for a question
 * @param {string} questionId - The ID of the question
 * @returns {any} The user's answer or null if not found
 */
export const getUserAnswer = (questionId) => {
  try {
    const progressData = getUserProgress();
    return progressData.savedAnswers[questionId]?.answer || null;
  } catch (error) {
    console.error('Error getting user answer:', error);
    return null;
  }
};

/**
 * Get all attempted questions
 * @returns {Object} Object with question IDs as keys and attempt data as values
 */
export const getAttemptedQuestions = () => {
  try {
    const progressData = getUserProgress();
    return progressData.attemptedQuestions || {};
  } catch (error) {
    console.error('Error getting attempted questions:', error);
    return {};
  }
};

/**
 * Clear all user progress
 */
export const clearUserProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user progress:', error);
  }
};

const localStorageUtils = {
  getUserProgress,
  saveUserProgress,
  markQuestionAttempted,
  saveUserAnswer,
  isQuestionAttempted,
  getUserAnswer,
  getAttemptedQuestions,
  clearUserProgress
};

export default localStorageUtils; 