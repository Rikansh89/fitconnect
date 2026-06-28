const User = require('../models/User');
const BuddyRequest = require('../models/BuddyRequest');
const { findMatches } = require('../utils/matching');

const getRecommendedMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const allUsers = await User.find({ _id: { $ne: req.user._id } });

    const sentRequests = await BuddyRequest.find({ sender: req.user._id });
    const receivedRequests = await BuddyRequest.find({ receiver: req.user._id });
    const buddyIds = new Set();
    [...sentRequests, ...receivedRequests].forEach((r) => {
      if (r.status === 'accepted') {
        buddyIds.add(r.sender.toString() === req.user._id.toString() ? r.receiver.toString() : r.sender.toString());
      }
    });

    const connectedIds = new Set(
      [...sentRequests, ...receivedRequests].map((r) =>
        r.sender.toString() === req.user._id.toString() ? r.receiver.toString() : r.sender.toString()
      )
    );

    const matches = findMatches(currentUser, allUsers).map((m) => ({
      ...m,
      requestStatus: connectedIds.has(m.user._id.toString())
        ? (buddyIds.has(m.user._id.toString()) ? 'accepted' : 'pending')
        : null,
    }));

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFilteredUsers = async (req, res) => {
  try {
    const { city, fitnessGoal, experienceLevel, workoutTime } = req.query;
    const filter = { _id: { $ne: req.user._id } };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (fitnessGoal) filter.fitnessGoal = fitnessGoal;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (workoutTime) filter.preferredWorkoutTime = workoutTime;

    const users = await User.find(filter);
    const currentUser = await User.findById(req.user._id);
    const matches = findMatches(currentUser, users);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedMatches, getFilteredUsers };
