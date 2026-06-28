import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotificationCount, getUnreadCount } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          getUnreadNotificationCount(),
          getUnreadCount(),
        ]);
        setNotifCount(notifRes.data.count);
        setMsgCount(msgRes.data.count);
      } catch {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [location]);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/buddies', label: 'Find', icon: '🔍' },
    { path: '/requests', label: 'Requests', icon: '🤝' },
    { path: '/chat', label: 'Chat', icon: '💬', badge: msgCount },
    { path: '/notifications', label: 'Alerts', icon: '🔔', badge: notifCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <span className="text-sm">💪</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Fit<span className="text-primary-400">Connect</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-red-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="w-px h-6 bg-dark-700 mx-2"></div>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === '/profile' || location.pathname === '/profile/edit'
                    ? 'bg-primary-500/10'
                    : 'hover:bg-dark-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/20">
                  {initials}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="ml-1 px-3 py-2 text-sm text-dark-400 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            <button
              className="md:hidden text-dark-300 hover:text-white p-2 hover:bg-dark-800 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-dark-800 bg-dark-900/95 backdrop-blur-xl">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-dark-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                {initials}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{user?.name}</div>
                <div className="text-dark-400 text-xs">{user?.email}</div>
              </div>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">{item.badge}</span>
                )}
              </Link>
            ))}
            <div className="border-t border-dark-800 mt-2 pt-2">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-dark-300 hover:bg-dark-800 transition-colors">
                <span>👤</span> Profile
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-dark-300 hover:bg-dark-800 transition-colors">
                <span>⚙️</span> Settings
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-dark-800 transition-colors">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
