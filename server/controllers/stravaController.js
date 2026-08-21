const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc  Exchange Strava OAuth code for tokens and store on user
// @route POST /api/strava/connect
const connectStrava = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error('Authorization code is required');
  }

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    res.status(400);
    throw new Error(data.message || 'Strava token exchange failed');
  }

  const user = await User.findById(req.user._id);
  user.stravaAccessToken = data.access_token;
  user.stravaRefreshToken = data.refresh_token;
  user.stravaConnected = true;
  await user.save();

  res.json({ connected: true });
});

// @desc  Pull recent activities from Strava and store locally
// @route POST /api/strava/sync
const syncStrava = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.stravaConnected) {
    res.status(400);
    throw new Error('Strava is not connected for this user');
  }

  const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
    headers: { Authorization: `Bearer ${user.stravaAccessToken}` },
  });
  const stravaActivities = await response.json();
  if (!response.ok) {
    res.status(400);
    throw new Error('Failed to fetch Strava activities');
  }

  const sportMap = { Swim: 'swim', Ride: 'bike', VirtualRide: 'bike', Run: 'run', TrailRun: 'run' };

  let imported = 0;
  for (const a of stravaActivities) {
    const sport = sportMap[a.type];
    if (!sport) continue;

    const exists = await Activity.findOne({ externalId: String(a.id), user: user._id });
    if (exists) continue;

    await Activity.create({
      user: user._id,
      sport,
      name: a.name,
      startDate: a.start_date,
      distanceMeters: a.distance,
      movingTimeSeconds: a.moving_time,
      elevationGainMeters: a.total_elevation_gain,
      avgHeartRate: a.average_heartrate,
      maxHeartRate: a.max_heartrate,
      avgWatts: a.average_watts,
      avgCadence: a.average_cadence,
      calories: a.calories,
      source: 'strava',
      externalId: String(a.id),
    });
    imported++;
  }

  res.json({ imported });
});

module.exports = { connectStrava, syncStrava };
