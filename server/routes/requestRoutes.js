const express = require('express');
const { protect } = require('../middleware/auth');
const {
  sendRequest,
  respondToRequest,
  getPendingRequests,
  getSentRequests,
  getBuddies,
  removeBuddy,
} = require('../controllers/requestController');
const router = express.Router();

router.post('/', protect, sendRequest);
router.put('/:id', protect, respondToRequest);
router.get('/pending', protect, getPendingRequests);
router.get('/sent', protect, getSentRequests);
router.get('/buddies', protect, getBuddies);
router.delete('/buddies/:buddyId', protect, removeBuddy);

module.exports = router;
