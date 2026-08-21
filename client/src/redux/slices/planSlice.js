import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPlans = createAsyncThunk('plans/fetch', async () => {
  const { data } = await api.get('/plans');
  return data;
});

export const generatePlan = createAsyncThunk('plans/generate', async (payload) => {
  const { data } = await api.post('/plans/generate', payload);
  return data;
});

export const toggleWorkout = createAsyncThunk('plans/toggleWorkout', async ({ planId, workoutId, completed }) => {
  const { data } = await api.put(`/plans/${planId}/workouts/${workoutId}`, { completed });
  return data;
});

const planSlice = createSlice({
  name: 'plans',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(generatePlan.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(toggleWorkout.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default planSlice.reducer;
