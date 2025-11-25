// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper: load all registered users from AsyncStorage.
// Stored format: { [usernameLower]: { username, email, password, avatar? } }
async function loadUsers() {
  const json = await AsyncStorage.getItem('users');
  return json ? JSON.parse(json) : {};
}

async function saveUsers(users) {
  await AsyncStorage.setItem('users', JSON.stringify(users));
}

// Login checks credentials against stored users and saves current session user
// (without password) under the `user` key.
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    const trimmedUsername = (username || '').trim();
    const usernameKey = trimmedUsername.toLowerCase();

    const users = await loadUsers();
    const record = users[usernameKey];

    if (!record) {
      return thunkAPI.rejectWithValue('No account found with that username. Please sign up first.');
    }

    if (record.password !== password) {
      return thunkAPI.rejectWithValue('Incorrect password for this username.');
    }

    const sessionUser = { username: record.username, email: record.email, avatar: record.avatar };
    await AsyncStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  }
);

// Register a new user; prevent duplicate usernames. Also logs the user in.
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, thunkAPI) => {
    const trimmedUsername = (username || '').trim();
    const trimmedEmail = (email || '').trim();
    const usernameKey = trimmedUsername.toLowerCase();

    const users = await loadUsers();

    if (users[usernameKey]) {
      return thunkAPI.rejectWithValue('An account with this username already exists. Please log in instead.');
    }

    const record = {
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    };

    users[usernameKey] = record;
    await saveUsers(users);

    const sessionUser = { username: record.username, email: record.email };
    await AsyncStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('user');
});

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // login
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Login failed';
      })
      // register
      .addCase(register.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Sign up failed';
      })
      // logout
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  }
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
