import { createSlice } from '@reduxjs/toolkit';
import storage from '../../services/storage';

const initialProfile = storage.getProfile();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialProfile,
  },
  reducers: {
    setupProfile: (state, action) => {
      const profile = storage.saveProfile({
        _id: storage.uid(),
        name: action.payload.name,
        raceGoal: action.payload.raceGoal || '70.3',
        ftp: action.payload.ftp || null,
        thresholdPace: action.payload.thresholdPace || '',
      });
      state.user = profile;
    },
    updateProfile: (state, action) => {
      const profile = storage.saveProfile({ ...state.user, ...action.payload });
      state.user = profile;
    },
    resetProfile: (state) => {
      storage.clearProfile();
      localStorage.removeItem(storage.KEYS.ACTIVITIES);
      localStorage.removeItem(storage.KEYS.PLANS);
      state.user = null;
    },
  },
});

export const { setupProfile, updateProfile, resetProfile } = authSlice.actions;
export default authSlice.reducer;
