import { createSlice } from '@reduxjs/toolkit';
import storage from '../../services/storage';

function buildWorkouts({ weeks, raceDate }) {
  const workouts = [];
  const start = new Date();
  const phaseSplit = { base: 0.4, build: 0.35, peak: 0.15, taper: 0.1 };
  const sportCycle = ['swim', 'bike', 'run', 'rest', 'bike', 'swim', 'run'];

  for (let week = 0; week < weeks; week++) {
    const weekFraction = week / weeks;
    let phase = 'base';
    if (weekFraction >= 1 - phaseSplit.taper) phase = 'taper';
    else if (weekFraction >= 1 - phaseSplit.taper - phaseSplit.peak) phase = 'peak';
    else if (weekFraction >= phaseSplit.base) phase = 'build';

    const intensity =
      phase === 'taper' ? 'recovery' : phase === 'peak' ? 'threshold' : phase === 'build' ? 'tempo' : 'endurance';

    for (let day = 0; day < 7; day++) {
      const sport = sportCycle[day % sportCycle.length];
      const date = new Date(start.getTime() + (week * 7 + day) * 24 * 60 * 60 * 1000).toISOString();
      if (sport === 'rest') {
        workouts.push({ _id: storage.uid(), sport: 'rest', title: 'Rest / Recovery', date, durationMinutes: 0, completed: false });
        continue;
      }
      const duration = phase === 'taper' ? 30 : phase === 'peak' ? 75 : phase === 'build' ? 60 : 45;
      workouts.push({
        _id: storage.uid(),
        sport,
        title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} ${sport}`,
        description: `${intensity} effort ${sport} session (${phase} phase)`,
        date,
        durationMinutes: duration,
        targetIntensity: intensity,
        completed: false,
      });
    }
  }
  return workouts;
}

const planSlice = createSlice({
  name: 'plans',
  initialState: { list: storage.getPlans() },
  reducers: {
    loadPlans: (state) => {
      state.list = storage.getPlans();
    },
    generatePlan: (state, action) => {
      const { raceType = '70.3', raceDate, weeks = 12 } = action.payload;
      storage.savePlan({
        name: `${raceType} Plan - ${weeks} weeks`,
        raceType,
        raceDate,
        startDate: new Date().toISOString(),
        weeks,
        workouts: buildWorkouts({ weeks, raceDate }),
      });
      state.list = storage.getPlans();
      return state;
    },
    toggleWorkout: (state, action) => {
      const { planId, workoutId, completed } = action.payload;
      storage.updateWorkout(planId, workoutId, { completed });
      state.list = storage.getPlans();
    },
  },
});

export const { loadPlans, generatePlan, toggleWorkout } = planSlice.actions;
export default planSlice.reducer;
