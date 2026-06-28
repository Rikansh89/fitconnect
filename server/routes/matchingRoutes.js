const express = require('express');
const { protect } = require('../middleware/auth');
const { getRecommendedMatches, getFilteredUsers } = require('../controllers/matchingController');
const router = express.Router();

router.get('/recommended', protect, getRecommendedMatches);
router.get('/filter', protect, getFilteredUsers);

module.exports = router;
