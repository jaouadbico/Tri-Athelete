const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sport: { type: String, enum: ['swim', 'bike', 'run', 'brick', 'strength'], required: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    distanceMeters: { type: Number, default: 0 },
    movingTimeSeconds: { type: Number, default: 0 },
    elevationGainMeters: { type: Number, default: 0 },
    avgHeartRate: { type: Number },
    maxHeartRate: { type: Number },
    avgWatts: { type: Number },
    avgCadence: { type: Number },
    calories: { type: Number },
    notes: { type: String },
    source: { type: String, enum: ['manual', 'strava', 'garmin', 'whoop'], default: 'manual' },
    externalId: { type: String },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model('Activity', activitySchema);
