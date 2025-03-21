import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuestions, getQuestion, filterQuestions } from '../utils/dataParser';
import { markQuestionAttempted, saveUserAnswer } from '../utils/localStorage';

// Async thunk to fetch questions for a chapter
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async ({ moduleId, chapterId }, { rejectWithValue }) => {
    try {
      return getQuestions(moduleId, chapterId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch a specific question
export const fetchQuestion = createAsyncThunk(
  'questions/fetchQuestion',
  async ({ moduleId, chapterId, questionId }, { rejectWithValue }) => {
    try {
      return getQuestion(moduleId, chapterId, questionId);
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
      const { questionId, answer, isCorrect } = action.payload;
      
      // Save to localStorage
      markQuestionAttempted(questionId, isCorrect);
      saveUserAnswer(questionId, answer);
      
      // Update state
      state.userAnswers[questionId] = {
        answer,
        isCorrect,
        timestamp: Date.now(),
      };
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
      });
  },
});

export const { 
  setCurrentQuestion, 
  clearCurrentQuestion, 
  setFilters, 
  clearFilters, 
  submitAnswer,
  clearQuestions
} = questionSlice.actions;

export default questionSlice.reducer; 