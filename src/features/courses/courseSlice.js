// src/features/courses/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchCourses } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCourses = createAsyncThunk('courses/fetch', async (query = 'programming') => {
  const data = await searchCourses(query);
  return data;
});

export const loadFavourites = createAsyncThunk('courses/loadFavs', async () => {
  const v = await AsyncStorage.getItem('favs');
  return v ? JSON.parse(v) : [];
});

export const toggleFavourite = createAsyncThunk('courses/toggleFav', async (course, thunkAPI) => {
  const state = thunkAPI.getState().courses;
  const favs = state.favourites || [];
  const exists = favs.find(f => f.id === course.id);
  const next = exists ? favs.filter(f => f.id !== course.id) : [...favs, course];
  await AsyncStorage.setItem('favs', JSON.stringify(next));
  return next;
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    favourites: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => { state.status = 'loading'; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCourses.rejected, state => { state.status = 'failed'; })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  }
});

export default courseSlice.reducer;
