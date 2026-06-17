import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : 'dark';
};

const initialState = {
  theme: getInitialTheme(),
  globalLoading: false,
  activeModals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    openModal: (state, action) => {
      state.activeModals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.activeModals[action.payload] = false;
    },
    closeAllModals: (state) => {
      state.activeModals = {};
    },
  },
});

export const { 
  toggleTheme, 
  setGlobalLoading, 
  openModal, 
  closeModal, 
  closeAllModals 
} = uiSlice.actions;

export default uiSlice.reducer;
