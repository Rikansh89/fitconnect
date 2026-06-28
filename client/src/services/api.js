import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('fitconnect-user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fitconnect-user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const uploadProfilePic = (formData) =>
  API.post('/profile/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getRecommended = () => API.get('/matching/recommended');
export const getFilteredUsers = (params) => API.get('/matching/filter', { params });

export const sendRequest = (receiverId) => API.post('/requests', { receiverId });
export const respondToRequest = (id, status) => API.put(`/requests/${id}`, { status });
export const getPendingRequests = () => API.get('/requests/pending');
export const getSentRequests = () => API.get('/requests/sent');
export const getBuddies = () => API.get('/requests/buddies');
export const removeBuddy = (buddyId) => API.delete(`/requests/buddies/${buddyId}`);

export const getConversations = () => API.get('/chat/conversations');
export const getMessages = (userId) => API.get(`/chat/${userId}`);
export const sendMessage = (receiverId, content) => API.post('/chat', { receiverId, content });
export const markMessagesRead = (userId) => API.put(`/chat/read/${userId}`);
export const getUnreadCount = () => API.get('/chat/unread');

export const getNotifications = () => API.get('/notifications');
export const getUnreadNotificationCount = () => API.get('/notifications/unread-count');
export const markNotificationRead = (id) => API.put(`/notifications/read/${id}`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');

export default API;
