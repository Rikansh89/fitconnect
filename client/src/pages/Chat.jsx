import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { getConversations, getMessages, markMessagesRead } from '../services/api';

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { onlineUsers, typingUsers, messages, setMessages, joinChat, sendMessageSocket, emitTyping, emitStopTyping, connected } = useSocket(user);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadChat(userId);
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      fetchConversations();
      const lastMsg = messages[messages.length - 1];
      const isForCurrentChat = activeChat && (
        (lastMsg.sender._id === activeChat._id && lastMsg.receiver === user?._id) ||
        (lastMsg.sender._id === user?._id && lastMsg.receiver === activeChat._id)
      );
      if (isForCurrentChat) {
        setChatMessages((prev) => {
          const exists = prev.find((m) => m._id === lastMsg._id);
          if (exists) return prev;
          return [...prev, lastMsg];
        });
      }
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (id) => {
    try {
      const [msgRes] = await Promise.all([
        getMessages(id),
        markMessagesRead(id),
      ]);
      setChatMessages(msgRes.data);
      const conv = conversations.find((c) => c.user._id === id);
      setActiveChat(conv?.user || { _id: id, name: 'Loading...' });
      joinChat(id);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    sendMessageSocket(activeChat._id, newMessage.trim());
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    if (!activeChat) return;
    emitTyping(activeChat._id);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(activeChat._id);
    }, 2000);
  };

  const isUserOnline = (id) => onlineUsers.includes(id);
  const isTyping = activeChat && typingUsers[activeChat._id];

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex">
      <div className={`w-full md:w-80 lg:w-96 bg-dark-800 border-r border-dark-700 flex flex-col ${userId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Messages</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-dark-400 text-xs">{connected ? 'Connected' : 'Reconnecting...'}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-dark-400 text-sm">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <Link
                key={conv.user._id}
                to={`/chat/${conv.user._id}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-dark-700/50 transition-colors ${
                  activeChat?._id === conv.user._id ? 'bg-dark-700' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                    {conv.user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {isUserOnline(conv.user._id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium truncate">{conv.user.name}</span>
                    <span className="text-dark-400 text-xs shrink-0 ml-2">{formatTime(conv.lastTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-400 text-xs truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-dark-900 ${!userId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-700 bg-dark-800">
              <Link to="/chat" className="md:hidden text-dark-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {activeChat.name?.charAt(0)?.toUpperCase()}
                </div>
                {isUserOnline(activeChat._id) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                )}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{activeChat.name}</div>
                <div className="text-dark-400 text-xs">
                  {isTyping ? 'typing...' : isUserOnline(activeChat._id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="flex items-center justify-center h-full text-dark-400 text-sm">
                  Start a conversation with {activeChat.name}
                </div>
              )}
              {chatMessages.map((msg, idx) => {
                const isMine = msg.sender._id === user?._id || msg.sender === user?._id;
                const showAvatar = idx === 0 || chatMessages[idx - 1]?.sender._id !== msg.sender._id;
                return (
                  <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`}>
                      {showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold shrink-0 mt-1">
                          {msg.sender.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          isMine ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-dark-800 text-white rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`text-dark-500 text-xs mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex items-center gap-2 text-dark-400 text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                  {activeChat.name} is typing
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-dark-700 bg-dark-800">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="input-field"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  autoFocus
                />
                <button type="submit" className="btn-primary" disabled={!newMessage.trim()}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-white font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a buddy from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
