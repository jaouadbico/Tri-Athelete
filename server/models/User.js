const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    raceGoal: {
      type: { type: String, enum: ['sprint', 'olympic', '70.3', 'ironman'], default: '70.3' },
      raceDate: { type: Date },
      targetTime: { type: String },
    },
    ftp: { type: Number },
    thresholdPace: { type: String },
    weight: { type: Number },
    stravaConnected: { type: Boolean, default: false },
    stravaAccessToken: { type: String },
    stravaRefreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
