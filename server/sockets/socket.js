const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const onlineUsers = new Map();

function setupSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id name');
      if (!user) return next(new Error('User not found'));
      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() });
    io.emit('user_online', { userId: socket.userId });

    socket.join(socket.userId);

    socket.on('join_chat', (otherUserId) => {
      const room = [socket.userId, otherUserId].sort().join('_');
      socket.join(room);
    });

    socket.on('typing', ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('typing', { senderId: socket.userId, senderName: socket.userName });
      }
    });

    socket.on('stop_typing', ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('stop_typing', { senderId: socket.userId });
      }
    });

    socket.on('send_message', async ({ receiverId, content }) => {
      try {
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content,
        });
        const populated = await message.populate('sender', 'name profilePicture');
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit('new_message', populated);
        }
        socket.emit('new_message', populated);
      } catch (err) {
        socket.emit('message_error', { error: err.message });
      }
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(socket.userId);
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      io.emit('user_offline', { userId: socket.userId });
    });
  });
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

module.exports = { setupSocket, getOnlineUsers };
