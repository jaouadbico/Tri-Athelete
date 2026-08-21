const asyncHandler = require('express-async-handler');
const TrainingPlan = require('../models/TrainingPlan');

// @desc  Get active training plan for user
// @route GET /api/plans
const getPlans = asyncHandler(async (req, res) => {
  const plans = await TrainingPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(plans);
});

// @desc  Generate a simple periodized plan (base -> build -> peak -> taper)
// @route POST /api/plans/generate
const generatePlan = asyncHandler(async (req, res) => {
  const { raceType = '70.3', raceDate, weeks = 12 } = req.body;
  if (!raceDate) {
    res.status(400);
    throw new Error('raceDate is required');
  }

  const start = new Date();
  const workouts = [];
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
      const date = new Date(start.getTime() + (week * 7 + day) * 24 * 60 * 60 * 1000);
      if (sport === 'rest') {
        workouts.push({ sport: 'rest', title: 'Rest / Recovery', date, durationMinutes: 0 });
        continue;
      }
      const duration = phase === 'taper' ? 30 : phase === 'peak' ? 75 : phase === 'build' ? 60 : 45;
      workouts.push({
        sport,
        title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} ${sport}`,
        description: `${intensity} effort ${sport} session (${phase} phase)`,
        date,
        durationMinutes: duration,
        targetIntensity: intensity,
      });
    }
  }

  const plan = await TrainingPlan.create({
    user: req.user._id,
    name: `${raceType} Plan - ${weeks} weeks`,
    raceType,
    raceDate,
    startDate: start,
    weeks,
    workouts,
  });

  res.status(201).json(plan);
});

// @desc  Mark a workout as completed
// @route PUT /api/plans/:planId/workouts/:workoutId
const updateWorkout = asyncHandler(async (req, res) => {
  const plan = await TrainingPlan.findOne({ _id: req.params.planId, user: req.user._id });
  if (!plan) {
    res.status(404);
    throw new Error('Plan not found');
  }
  const workout = plan.workouts.id(req.params.workoutId);
  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }
  Object.assign(workout, req.body);
  await plan.save();
  res.json(plan);
});

module.exports = { getPlans, generatePlan, updateWorkout };
