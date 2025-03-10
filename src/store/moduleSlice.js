import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getModules, getChapters } from '../utils/dataParser';

// Async thunk to fetch modules
export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async (_, { rejectWithValue }) => {
    try {
      return getModules();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch chapters for a module
export const fetchChapters = createAsyncThunk(
  'modules/fetchChapters',
  async (moduleId, { rejectWithValue }) => {
    try {
      return {
        moduleId,
        chapters: getChapters(moduleId)
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  modules: [],
  chapters: {},
  currentModule: null,
  currentChapter: null,
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
    },
    setCurrentChapter: (state, action) => {
      state.currentChapter = action.payload;
    },
    clearCurrentModule: (state) => {
      state.currentModule = null;
      state.currentChapter = null;
    },
    clearCurrentChapter: (state) => {
      state.currentChapter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch chapters
      .addCase(fetchChapters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters[action.payload.moduleId] = action.payload.chapters;
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentModule, 
  setCurrentChapter, 
  clearCurrentModule, 
  clearCurrentChapter 
} = moduleSlice.actions;

export default moduleSlice.reducer; 