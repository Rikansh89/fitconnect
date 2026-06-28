const express = require('express');
const { protect } = require('../middleware/auth');
const { getNotifications, markNotificationRead, markAllRead, getUnreadNotificationCount } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadNotificationCount);
router.put('/read/:id', protect, markNotificationRead);
router.put('/read-all', protect, markAllRead);

module.exports = router;
