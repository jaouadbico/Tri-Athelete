const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    sport: { type: String, enum: ['swim', 'bike', 'run', 'brick', 'strength', 'rest'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    durationMinutes: { type: Number },
    targetIntensity: { type: String, enum: ['recovery', 'endurance', 'tempo', 'threshold', 'vo2max', 'race'] },
    completed: { type: Boolean, default: false },
    completedActivity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  },
  { _id: true }
);

const trainingPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    raceType: { type: String, enum: ['sprint', 'olympic', '70.3', 'ironman'], default: '70.3' },
    raceDate: { type: Date },
    startDate: { type: Date, required: true },
    weeks: { type: Number, default: 12 },
    workouts: [workoutSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingPlan', trainingPlanSchema);
