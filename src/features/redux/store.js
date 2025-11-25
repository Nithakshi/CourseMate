// src/features/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import courseReducer from '../courses/courseSlice';
import themeReducer from '../theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    theme: themeReducer,
  },
});
