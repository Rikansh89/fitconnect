const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, city, fitnessGoal, experienceLevel, preferredWorkoutTime, gymName, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (preferredWorkoutTime) user.preferredWorkoutTime = preferredWorkoutTime;
    if (gymName) user.gymName = gymName;
    if (bio !== undefined) user.bio = bio;
    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findById(req.user._id);
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePicture };
