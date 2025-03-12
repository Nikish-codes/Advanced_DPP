import paperData from '../data/years.json';

// Create a map of paper IDs to paper data for quick lookup
const paperMap = new Map(paperData.map(paper => [paper._id, paper]));

// Get unique years from paper data
const years = [...new Set(paperData.map(paper => new Date(paper.heldOn).getFullYear()))].sort((a, b) => b - a);

// Question ID patterns for different years and papers
const questionPatterns = {
  // 2023 questions start with 64b16, 66965
  "64b16": { year: 2023, paperNumber: 1 },
  "66965": { year: 2023, paperNumber: 2 },
  // 2022 questions start with 632c8
  "632c8": { year: 2022, paperNumber: 1 },
  // 2021 questions start with 619f9
  "619f9": { year: 2021, paperNumber: 1 },
  // Add more patterns as needed
};

// Helper function to get paper info from question ID
const getPaperFromQuestionId = (questionId) => {
  if (!questionId) return null;
  
  // Try to match the first 5 characters with known patterns
  const prefix = questionId.substring(0, 5);
  const yearInfo = questionPatterns[prefix];
  
  if (yearInfo) {
    return {
      title: `JEE Advanced ${yearInfo.year} (Paper ${yearInfo.paperNumber})`,
      shortName: `${yearInfo.year} (Paper ${yearInfo.paperNumber})`,
      _id: questionId,
      year: yearInfo.year,
      paperNumber: yearInfo.paperNumber
    };
  }
  
  // If no pattern match, try to find a paper with similar ID prefix
  for (const paper of paperData) {
    if (questionId.startsWith(paper._id.substring(0, 5))) {
      return paper;
    }
  }
  
  return null;
};

// Temporarily disabled paper information functions
export const getPaperInfo = () => null;
export const getPaperTitle = () => '';
export const getPaperFullTitle = () => '';
export const getAvailableYears = () => [];

// For backward compatibility
export const getPaperInfoById = getPaperInfo;
export const getPaperTitleById = getPaperTitle;
export const getPaperFullTitleById = getPaperFullTitle; 