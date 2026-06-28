import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'buddy_request': return '🤝';
      case 'request_accepted': return '✅';
      case 'new_message': return '💬';
      default: return '🔔';
    }
  };

  const getLink = (notif) => {
    if (notif.type === 'buddy_request') return '/requests';
    if (notif.type === 'request_accepted') return '/requests';
    if (notif.type === 'new_message') return `/chat/${notif.from?._id}`;
    return '#';
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button className="text-primary-500 text-sm hover:underline" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-white font-semibold mb-2">No notifications</h3>
          <p className="text-dark-400 text-sm">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Link
              key={notif._id}
              to={getLink(notif)}
              onClick={() => !notif.read && handleMarkRead(notif._id)}
              className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                notif.read ? 'bg-dark-800/50' : 'bg-dark-800 border-l-4 border-primary-500'
              }`}
            >
              <div className="text-2xl shrink-0 mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {notif.from && (
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold shrink-0">
                      {notif.from.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <p className={`text-sm ${notif.read ? 'text-dark-300' : 'text-white font-medium'}`}>
                    {notif.message}
                  </p>
                </div>
                <p className="text-dark-500 text-xs mt-1">
                  {new Date(notif.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-2"></div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
