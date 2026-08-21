import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activitySlice from './slices/activitySlice';
import planSlice from './slices/planSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitySlice,
    plans: planSlice,
  },
});
