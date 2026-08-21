const express = require('express');
const router = express.Router();
const { getPlans, generatePlan, updateWorkout } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getPlans);
router.post('/generate', generatePlan);
router.put('/:planId/workouts/:workoutId', updateWorkout);

module.exports = router;
