import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: true,
  sidebarOpen: false,
  showSolution: false,
  loading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleShowSolution: (state) => {
      state.showSolution = !state.showSolution;
    },
    setShowSolution: (state, action) => {
      state.showSolution = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { 
  toggleDarkMode, 
  toggleSidebar, 
  setSidebarOpen, 
  toggleShowSolution, 
  setShowSolution,
  setLoading,
  setNotification,
  clearNotification
} = uiSlice.actions;

export default uiSlice.reducer; 