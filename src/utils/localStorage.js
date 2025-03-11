const STORAGE_KEY_PREFIX = 'jee_adv_progress';

/**
 * Get the storage key based on data source
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 * @returns {string} The storage key
 */
const getStorageKey = (dataSource = 'DPP') => {
  return `${STORAGE_KEY_PREFIX}_${dataSource.toLowerCase()}`;
};

/**
 * Get user progress from localStorage
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 * @returns {Object} User progress object
 */
export const getUserProgress = (dataSource = 'DPP') => {
  try {
    const storageKey = getStorageKey(dataSource);
    const progressData = localStorage.getItem(storageKey);
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
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 */
export const saveUserProgress = (progressData, dataSource = 'DPP') => {
  try {
    const storageKey = getStorageKey(dataSource);
    localStorage.setItem(storageKey, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving user progress to localStorage:', error);
  }
};

/**
 * Mark a question as attempted
 * @param {string} questionId - The ID of the question
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {number} score - The score for the question
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 */
export const markQuestionAttempted = (questionId, isCorrect, score = 0, dataSource = 'DPP') => {
  try {
    const progressData = getUserProgress(dataSource);
    
    progressData.attemptedQuestions[questionId] = {
      isCorrect,
      score,
      timestamp: Date.now()
    };
    
    saveUserProgress(progressData, dataSource);
  } catch (error) {
    console.error('Error marking question as attempted:', error);
  }
};

/**
 * Save user's answer for a question
 * @param {string} questionId - The ID of the question
 * @param {any} answer - The user's answer
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 */
export const saveUserAnswer = (questionId, answer, dataSource = 'DPP') => {
  try {
    const progressData = getUserProgress(dataSource);
    
    progressData.savedAnswers[questionId] = {
      answer,
      timestamp: Date.now()
    };
    
    saveUserProgress(progressData, dataSource);
  } catch (error) {
    console.error('Error saving user answer:', error);
  }
};

/**
 * Check if a question has been attempted
 * @param {string} questionId - The ID of the question
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 * @returns {boolean} Whether the question has been attempted
 */
export const isQuestionAttempted = (questionId, dataSource = 'DPP') => {
  try {
    const progressData = getUserProgress(dataSource);
    return !!progressData.attemptedQuestions[questionId];
  } catch (error) {
    console.error('Error checking if question is attempted:', error);
    return false;
  }
};

/**
 * Get user's answer for a question
 * @param {string} questionId - The ID of the question
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 * @returns {any} The user's answer or null if not found
 */
export const getUserAnswer = (questionId, dataSource = 'DPP') => {
  try {
    const progressData = getUserProgress(dataSource);
    return progressData.savedAnswers[questionId]?.answer || null;
  } catch (error) {
    console.error('Error getting user answer:', error);
    return null;
  }
};

/**
 * Get all attempted questions
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 * @returns {Object} Object with question IDs as keys and attempt data as values
 */
export const getAttemptedQuestions = (dataSource = 'DPP') => {
  try {
    const progressData = getUserProgress(dataSource);
    return progressData.attemptedQuestions || {};
  } catch (error) {
    console.error('Error getting attempted questions:', error);
    return {};
  }
};

/**
 * Clear all user progress
 * @param {string} dataSource - The data source ('DPP' or 'PYQ')
 */
export const clearUserProgress = (dataSource = 'DPP') => {
  try {
    const storageKey = getStorageKey(dataSource);
    localStorage.removeItem(storageKey);
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