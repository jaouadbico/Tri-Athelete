const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');

// @desc  Get all activities for logged-in user (optional ?sport= filter)
// @route GET /api/activities
const getActivities = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.sport) filter.sport = req.query.sport;

  const activities = await Activity.find(filter).sort({ startDate: -1 }).limit(200);
  res.json(activities);
});

// @desc  Create a manual activity entry
// @route POST /api/activities
const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create({ ...req.body, user: req.user._id });
  res.status(201).json(activity);
});

// @desc  Get a single activity
// @route GET /api/activities/:id
const getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findOne({ _id: req.params.id, user: req.user._id });
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  res.json(activity);
});

// @desc  Update an activity
// @route PUT /api/activities/:id
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findOne({ _id: req.params.id, user: req.user._id });
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  Object.assign(activity, req.body);
  const updated = await activity.save();
  res.json(updated);
});

// @desc  Delete an activity
// @route DELETE /api/activities/:id
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  res.json({ message: 'Activity removed' });
});

// @desc  Weekly/monthly summary stats grouped by sport
// @route GET /api/activities/summary
const getSummary = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const summary = await Activity.aggregate([
    { $match: { user: req.user._id, startDate: { $gte: since } } },
    {
      $group: {
        _id: '$sport',
        totalDistanceMeters: { $sum: '$distanceMeters' },
        totalTimeSeconds: { $sum: '$movingTimeSeconds' },
        sessionCount: { $sum: 1 },
      },
    },
  ]);

  res.json({ periodDays: days, summary });
});

module.exports = {
  getActivities,
  createActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  getSummary,
};
