const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/profileController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/upload', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
