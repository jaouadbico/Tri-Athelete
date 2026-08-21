const express = require('express');
const router = express.Router();
const { connectStrava, syncStrava } = require('../controllers/stravaController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/connect', connectStrava);
router.post('/sync', syncStrava);

module.exports = router;
