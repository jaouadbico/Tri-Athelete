import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchActivities = createAsyncThunk('activities/fetch', async (sport) => {
  const { data } = await api.get('/activities', { params: sport ? { sport } : {} });
  return data;
});

export const fetchSummary = createAsyncThunk('activities/summary', async (days = 7) => {
  const { data } = await api.get('/activities/summary', { params: { days } });
  return data;
});

export const addActivity = createAsyncThunk('activities/add', async (payload) => {
  const { data } = await api.post('/activities', payload);
  return data;
});

const activitySlice = createSlice({
  name: 'activities',
  initialState: { list: [], summary: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchActivities.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
      .addCase(fetchSummary.fulfilled, (state, action) => { state.summary = action.payload; })
      .addCase(addActivity.fulfilled, (state, action) => { state.list.unshift(action.payload); });
  },
});

export default activitySlice.reducer;
