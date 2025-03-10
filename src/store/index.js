import { configureStore } from '@reduxjs/toolkit';
import moduleReducer from './moduleSlice';
import questionReducer from './questionSlice';
import uiReducer from './uiSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('grafiteState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('grafiteState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    modules: moduleReducer,
    questions: questionReducer,
    ui: uiReducer,
  },
  preloadedState: persistedState,
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store; 