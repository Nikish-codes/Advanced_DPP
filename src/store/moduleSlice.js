import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getModules, getChapters } from '../utils/dataParser';

// Async thunk to fetch modules
export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { dataSource } = getState().modules;
      return getModules(dataSource);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch chapters for a module
export const fetchChapters = createAsyncThunk(
  'modules/fetchChapters',
  async (moduleId, { getState, rejectWithValue }) => {
    try {
      const { dataSource } = getState().modules;
      return {
        moduleId,
        chapters: getChapters(moduleId, dataSource)
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
  dataSource: 'DPP', // Default to DPP
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
    setDataSource: (state, action) => {
      state.dataSource = action.payload;
      // Reset data when changing source
      state.modules = [];
      state.chapters = {};
      state.currentModule = null;
      state.currentChapter = null;
      state.loading = true; // Set loading to true when changing data source
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
  clearCurrentChapter,
  setDataSource
} = moduleSlice.actions;

export default moduleSlice.reducer; 