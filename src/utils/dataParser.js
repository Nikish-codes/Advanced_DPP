import data from '../data/ADV_DPP.json';

/**
 * Get all available modules (subjects) from the data
 * @returns {Array} Array of module objects with id and title
 */
export const getModules = () => {
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
 * @returns {Array} Array of chapter objects
 */
export const getChapters = (moduleId) => {
  const modules = getModules();
  const module = modules.find(m => m.id === moduleId);
  
  if (!module) return [];
  
  return data[module.key]?.chapters || [];
};

/**
 * Get a specific chapter by its ID and module ID
 * @param {string} moduleId - The ID of the module
 * @param {string} chapterId - The ID of the chapter
 * @returns {Object|null} The chapter object or null if not found
 */
export const getChapter = (moduleId, chapterId) => {
  const chapters = getChapters(moduleId);
  return chapters.find(chapter => chapter.id === chapterId) || null;
};

/**
 * Get all questions for a specific chapter
 * @param {string} moduleId - The ID of the module
 * @param {string} chapterId - The ID of the chapter
 * @returns {Array} Array of question objects
 */
export const getQuestions = (moduleId, chapterId) => {
  const chapter = getChapter(moduleId, chapterId);
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
 * @returns {Object|null} The question object or null if not found
 */
export const getQuestion = (moduleId, chapterId, questionId) => {
  const questions = getQuestions(moduleId, chapterId);
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
  getModules,
  getChapters,
  getChapter,
  getQuestions,
  getQuestion,
  filterQuestions
};

export default dataParserUtils; 