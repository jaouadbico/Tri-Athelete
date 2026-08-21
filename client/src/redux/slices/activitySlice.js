import { createSlice } from '@reduxjs/toolkit';
import storage from '../../services/storage';

function computeSummary(activities, days) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const bySport = {};
  activities
    .filter((a) => new Date(a.startDate).getTime() >= since)
    .forEach((a) => {
      if (!bySport[a.sport]) bySport[a.sport] = { _id: a.sport, totalDistanceMeters: 0, totalTimeSeconds: 0, sessionCount: 0 };
      bySport[a.sport].totalDistanceMeters += Number(a.distanceMeters) || 0;
      bySport[a.sport].totalTimeSeconds += Number(a.movingTimeSeconds) || 0;
      bySport[a.sport].sessionCount += 1;
    });
  return { periodDays: days, summary: Object.values(bySport) };
}

const initialActivities = storage.getActivities();

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    list: initialActivities,
    summary: computeSummary(initialActivities, 7),
  },
  reducers: {
    loadActivities: (state) => {
      state.list = storage.getActivities();
      state.summary = computeSummary(state.list, 7);
    },
    addActivity: (state, action) => {
      storage.addActivity(action.payload);
      state.list = storage.getActivities();
      state.summary = computeSummary(state.list, 7);
      return state;
    },
    removeActivity: (state, action) => {
      state.list = storage.deleteActivity(action.payload);
      state.summary = computeSummary(state.list, 7);
    },
    refreshSummary: (state, action) => {
      state.summary = computeSummary(state.list, action.payload || 7);
    },
  },
});

export const { loadActivities, addActivity, removeActivity, refreshSummary } = activitySlice.actions;
export default activitySlice.reducer;
