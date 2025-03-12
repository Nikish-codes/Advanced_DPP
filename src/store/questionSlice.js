import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuestions, getQuestion, filterQuestions } from '../utils/dataParser';
import { 
  markQuestionAttempted, 
  saveUserAnswer, 
  toggleQuestionBookmark, 
  getBookmarkedQuestions 
} from '../utils/localStorage';

// Async thunk to fetch questions for a chapter
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async ({ moduleId, chapterId }, { getState, rejectWithValue }) => {
    try {
      const { dataSource } = getState().modules;
      return getQuestions(moduleId, chapterId, dataSource);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch a specific question
export const fetchQuestion = createAsyncThunk(
  'questions/fetchQuestion',
  async ({ moduleId, chapterId, questionId }, { getState, rejectWithValue }) => {
    try {
      const { dataSource } = getState().modules;
      return getQuestion(moduleId, chapterId, questionId, dataSource);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch bookmarked questions
export const fetchBookmarkedQuestions = createAsyncThunk(
  'questions/fetchBookmarkedQuestions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { dataSource } = getState().modules;
      return getBookmarkedQuestions(dataSource);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to process question content with images and LaTeX
export const processQuestionContent = (content) => {
  if (!content) return '';
  
  // Ensure content is a string
  const contentStr = String(content);
  
  // If the content already has HTML tags, return it as is
  if (contentStr.includes('<img') || contentStr.includes('<p>') || contentStr.includes('<div>')) {
    return contentStr;
  }
  
  // Check for LaTeX delimiters
  const hasInlineMath = contentStr.includes('$') || contentStr.includes('\\(') || contentStr.includes('\\)');
  const hasDisplayMath = contentStr.includes('$$') || contentStr.includes('\\[') || contentStr.includes('\\]');
  
  // If it has LaTeX, we need to be careful with wrapping
  if (hasInlineMath || hasDisplayMath) {
    // Split by double newlines to preserve paragraph structure
    const paragraphs = contentStr.split(/\n\s*\n/);
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }
  
  // Otherwise, wrap it in a paragraph for consistent styling
  return `<p>${contentStr}</p>`;
};

const initialState = {
  questions: [],
  filteredQuestions: [],
  currentQuestion: null,
  bookmarkedQuestions: {},
  filters: {
    level: null,
    type: null,
  },
  loading: false,
  error: null,
  userAnswers: {},
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredQuestions = filterQuestions(state.questions, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        level: null,
        type: null,
      };
      state.filteredQuestions = state.questions;
    },
    submitAnswer: (state, action) => {
      const { questionId, answer, isCorrect, score } = action.payload;
      
      // Save to localStorage
      markQuestionAttempted(questionId, isCorrect, score);
      saveUserAnswer(questionId, answer);
      
      // Update state
      state.userAnswers[questionId] = {
        answer,
        isCorrect,
        score,
        timestamp: Date.now(),
      };
    },
    toggleBookmark: (state, action) => {
      const { questionId, questionData, dataSource } = action.payload;
      
      // Toggle in localStorage and get new status
      const isBookmarked = toggleQuestionBookmark(questionId, questionData, dataSource);
      
      // Update state
      if (isBookmarked) {
        state.bookmarkedQuestions[questionId] = {
          ...questionData,
          timestamp: Date.now()
        };
      } else {
        delete state.bookmarkedQuestions[questionId];
      }
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.filteredQuestions = [];
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.filteredQuestions = filterQuestions(action.payload, state.filters);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch question
      .addCase(fetchQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bookmarked questions
      .addCase(fetchBookmarkedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarkedQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarkedQuestions = action.payload;
      })
      .addCase(fetchBookmarkedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentQuestion, 
  clearCurrentQuestion, 
  setFilters, 
  clearFilters, 
  submitAnswer,
  toggleBookmark,
  clearQuestions
} = questionSlice.actions;

export default questionSlice.reducer; 