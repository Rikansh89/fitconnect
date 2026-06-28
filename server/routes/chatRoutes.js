const express = require('express');
const { protect } = require('../middleware/auth');
const { getMessages, sendMessage, markAsRead, getUnreadCount, getConversations } = require('../controllers/chatController');
const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/unread', protect, getUnreadCount);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/read/:userId', protect, markAsRead);

module.exports = router;
