const KEYS = {
  PROFILE: 'tri_profile',
  ACTIVITIES: 'tri_activities',
  PLANS: 'tri_plans',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const storage = {
  KEYS,
  getProfile: () => read(KEYS.PROFILE, null),
  saveProfile: (profile) => {
    write(KEYS.PROFILE, profile);
    return profile;
  },
  clearProfile: () => localStorage.removeItem(KEYS.PROFILE),

  getActivities: () => read(KEYS.ACTIVITIES, []),
  addActivity: (activity) => {
    const list = read(KEYS.ACTIVITIES, []);
    const withId = { ...activity, _id: uid(), createdAt: new Date().toISOString() };
    const next = [withId, ...list];
    write(KEYS.ACTIVITIES, next);
    return withId;
  },
  deleteActivity: (id) => {
    const list = read(KEYS.ACTIVITIES, []).filter((a) => a._id !== id);
    write(KEYS.ACTIVITIES, list);
    return list;
  },

  getPlans: () => read(KEYS.PLANS, []),
  savePlan: (plan) => {
    const list = read(KEYS.PLANS, []);
    const withId = { ...plan, _id: uid(), active: true };
    const next = [withId, ...list.map((p) => ({ ...p, active: false }))];
    write(KEYS.PLANS, next);
    return withId;
  },
  updateWorkout: (planId, workoutId, updates) => {
    const list = read(KEYS.PLANS, []);
    const planIdx = list.findIndex((p) => p._id === planId);
    if (planIdx === -1) return null;
    const workouts = list[planIdx].workouts.map((w) =>
      w._id === workoutId ? { ...w, ...updates } : w
    );
    list[planIdx] = { ...list[planIdx], workouts };
    write(KEYS.PLANS, list);
    return list[planIdx];
  },

  uid,
};

export default storage;
