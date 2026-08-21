import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const storedUser = JSON.parse(localStorage.getItem('user'));

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
