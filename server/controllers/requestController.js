const BuddyRequest = require('../models/BuddyRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    const existing = await BuddyRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    });
    if (existing) {
      return res.status(400).json({ message: 'Request already exists' });
    }
    const request = await BuddyRequest.create({ sender: req.user._id, receiver: receiverId });
    const receiver = await User.findById(receiverId);
    await Notification.create({
      user: receiverId,
      from: req.user._id,
      type: 'buddy_request',
      message: `${req.user.name} sent you a buddy request`,
      relatedId: request._id,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await BuddyRequest.findById(id).populate('sender', 'name');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = status;
    await request.save();
    if (status === 'accepted') {
      await Notification.create({
        user: request.sender._id,
        from: req.user._id,
        type: 'request_accepted',
        message: `${req.user.name} accepted your buddy request`,
        relatedId: request._id,
      });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      receiver: req.user._id,
      status: 'pending',
    }).populate('sender', 'name email profilePicture city fitnessGoal experienceLevel');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      sender: req.user._id,
    }).populate('receiver', 'name email profilePicture city fitnessGoal experienceLevel');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBuddies = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'accepted',
    }).populate('sender receiver', 'name email profilePicture city fitnessGoal experienceLevel isOnline lastSeen');
    const buddies = requests.map((r) => {
      const buddy = r.sender._id.toString() === req.user._id.toString() ? r.receiver : r.sender;
      return buddy;
    });
    res.json(buddies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeBuddy = async (req, res) => {
  try {
    const { buddyId } = req.params;
    await BuddyRequest.deleteOne({
      $or: [
        { sender: req.user._id, receiver: buddyId, status: 'accepted' },
        { sender: buddyId, receiver: req.user._id, status: 'accepted' },
      ],
    });
    res.json({ message: 'Buddy removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, respondToRequest, getPendingRequests, getSentRequests, getBuddies, removeBuddy };
