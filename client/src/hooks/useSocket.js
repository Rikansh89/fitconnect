import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket(user) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    const socket = io('/', {
      auth: { token: user.token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    socket.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('typing', ({ senderId, senderName }) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: senderName }));
    });

    socket.on('stop_typing', ({ senderId }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[senderId];
        return copy;
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user?.token]);

  const joinChat = (otherUserId) => {
    socketRef.current?.emit('join_chat', otherUserId);
  };

  const sendMessageSocket = (receiverId, content) => {
    socketRef.current?.emit('send_message', { receiverId, content });
  };

  const emitTyping = (receiverId) => {
    socketRef.current?.emit('typing', { receiverId });
  };

  const emitStopTyping = (receiverId) => {
    socketRef.current?.emit('stop_typing', { receiverId });
  };

  return {
    socket: socketRef.current,
    connected,
    onlineUsers,
    typingUsers,
    messages,
    setMessages,
    joinChat,
    sendMessageSocket,
    emitTyping,
    emitStopTyping,
  };
}
