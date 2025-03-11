import dppData from '../data/ADV_DPP.json';
import pyqData from '../data/ADV_PYQ.json';

/**
 * Get the appropriate data source based on the selected type
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Object} The data object
 */
const getDataSource = (dataSource = 'DPP') => {
  return dataSource === 'PYQ' ? pyqData : dppData;
};

/**
 * Get all available modules (subjects) from the data
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Array} Array of module objects with id and title
 */
export const getModules = (dataSource = 'DPP') => {
  const data = getDataSource(dataSource);
  const modules = [];
  
  // Extract modules from the data
  if (data.JEE_ADV_PHY_MODULES) {
    modules.push({
      id: 'physics',
      title: 'Physics',
      key: 'JEE_ADV_PHY_MODULES'
    });
  }
  
  if (data.JEE_ADV_CHEM_MODULES) {
    modules.push({
      id: 'chemistry',
      title: 'Chemistry',
      key: 'JEE_ADV_CHEM_MODULES'
    });
  }
  
  if (data.JEE_ADV_MATH_MODULES) {
    modules.push({
      id: 'mathematics',
      title: 'Mathematics',
      key: 'JEE_ADV_MATH_MODULES'
    });
  }
  
  return modules;
};

/**
 * Get all chapters for a specific module
 * @param {string} moduleId - The ID of the module
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Array} Array of chapter objects
 */
export const getChapters = (moduleId, dataSource = 'DPP') => {
  const data = getDataSource(dataSource);
  const modules = getModules(dataSource);
  const module = modules.find(m => m.id === moduleId);
  
  if (!module) return [];
  
  return data[module.key]?.chapters || [];
};

/**
 * Get a specific chapter by its ID and module ID
 * @param {string} moduleId - The ID of the module
 * @param {string} chapterId - The ID of the chapter
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Object|null} The chapter object or null if not found
 */
export const getChapter = (moduleId, chapterId, dataSource = 'DPP') => {
  const chapters = getChapters(moduleId, dataSource);
  return chapters.find(chapter => chapter.id === chapterId) || null;
};

/**
 * Get all questions for a specific chapter
 * @param {string} moduleId - The ID of the module
 * @param {string} chapterId - The ID of the chapter
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Array} Array of question objects
 */
export const getQuestions = (moduleId, chapterId, dataSource = 'DPP') => {
  const chapter = getChapter(moduleId, chapterId, dataSource);
  if (!chapter) return [];
  
  const questions = [];
  
  // Flatten questions from all sections
  chapter.sections.forEach(section => {
    if (section.questions && Array.isArray(section.questions)) {
      questions.push(...section.questions);
    }
  });
  
  return questions;
};

/**
 * Get a specific question by its ID
 * @param {string} moduleId - The ID of the module
 * @param {string} chapterId - The ID of the chapter
 * @param {string} questionId - The ID of the question
 * @param {string} dataSource - The data source type ('DPP' or 'PYQ')
 * @returns {Object|null} The question object or null if not found
 */
export const getQuestion = (moduleId, chapterId, questionId, dataSource = 'DPP') => {
  const questions = getQuestions(moduleId, chapterId, dataSource);
  return questions.find(question => question.question_id === questionId) || null;
};

/**
 * Filter questions based on criteria
 * @param {Array} questions - Array of question objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered array of question objects
 */
export const filterQuestions = (questions, filters) => {
  if (!filters || Object.keys(filters).length === 0) return questions;
  
  return questions.filter(question => {
    let match = true;
    
    if (filters.level && question.level !== filters.level) {
      match = false;
    }
    
    if (filters.type && question.type !== filters.type) {
      match = false;
    }
    
    return match;
  });
};

const dataParserUtils = {
  getDataSource,
  getModules,
  getChapters,
  getChapter,
  getQuestions,
  getQuestion,
  filterQuestions
};

export default dataParserUtils; 