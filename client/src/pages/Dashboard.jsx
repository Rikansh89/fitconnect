import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getRecommended, getPendingRequests, getBuddies, getConversations } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [buddies, setBuddies] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, recommendedRes, pendingRes, buddiesRes, convosRes] = await Promise.all([
          getProfile(),
          getRecommended(),
          getPendingRequests(),
          getBuddies(),
          getConversations(),
        ]);
        setProfile(profileRes.data);
        setRecommended(recommendedRes.data.slice(0, 3));
        setPendingCount(pendingRes.data.length);
        setBuddies(buddiesRes.data);
        setConversations(convosRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-blue-600/20 rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative flex items-center gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg shadow-primary-500/30">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome back, {profile?.name?.split(' ')[0] || 'Fitness Star'}
            </h1>
            <p className="text-dark-300 text-sm mt-0.5">Ready to crush your goals today? 🔥</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Link to="/buddies" className="bg-primary-500 hover:bg-primary-400 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg shadow-primary-500/25 transition-all">
              Find Buddies
            </Link>
            <Link to="/profile/edit" className="bg-dark-800 hover:bg-dark-700 border border-dark-600 text-dark-200 text-sm font-medium px-4 py-2 rounded-lg transition-all">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Match Score', value: profile?.fitnessGoal ? 'High' : 'Set Goal', icon: '🎯', color: 'from-primary-400 to-blue-400' },
          { label: 'Requests', value: pendingCount, icon: '🤝', color: 'from-yellow-400 to-orange-400' },
          { label: 'Buddies', value: buddies.length, icon: '👥', color: 'from-green-400 to-emerald-400' },
          { label: 'Messages', value: conversations.reduce((a, c) => a + c.unread, 0) || '0', icon: '💬', color: 'from-purple-400 to-pink-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-4 hover:bg-dark-800 hover:border-dark-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>🔥</span> Recommended Buddies
            </h2>
            <Link to="/buddies" className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors">
              View All →
            </Link>
          </div>
          {recommended.length === 0 ? (
            <div className="text-dark-500 text-sm text-center py-8">
              <div className="text-3xl mb-2">📝</div>
              Complete your profile for matches
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommended.map((match) => (
                <Link
                  key={match.user._id}
                  to="/buddies"
                  className="flex items-center gap-3 bg-dark-900/40 rounded-xl p-3 hover:bg-dark-900/70 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20">
                    {match.user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">{match.user.name}</div>
                    <div className="text-dark-500 text-xs">{match.user.fitnessGoal?.replace(/_/g, ' ') || 'No goal set'} · {match.user.city || 'N/A'}</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary-500/10 text-primary-400 text-xs font-bold px-2.5 py-1 rounded-lg">{match.compatibilityScore}%</div>
                    <div className="text-dark-500 text-[10px] mt-0.5">match</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>💬</span> Recent Messages
            </h2>
            <Link to="/chat" className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors">
              View All →
            </Link>
          </div>
          {conversations.length === 0 ? (
            <div className="text-dark-500 text-sm text-center py-8">
              <div className="text-3xl mb-2">💬</div>
              No messages yet
            </div>
          ) : (
            <div className="space-y-2.5">
              {conversations.map((conv) => (
                <Link
                  key={conv.user._id}
                  to={`/chat/${conv.user._id}`}
                  className="flex items-center gap-3 bg-dark-900/40 rounded-xl p-3 hover:bg-dark-900/70 transition-colors group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                      {conv.user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {conv.user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">{conv.user.name}</div>
                      {conv.unread > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2">{conv.unread}</span>
                      )}
                    </div>
                    <div className="text-dark-500 text-xs truncate">{conv.lastMessage}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>👥</span> Active Buddies
            </h2>
            <Link to="/requests" className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors">
              Manage →
            </Link>
          </div>
          {buddies.length === 0 ? (
            <div className="text-dark-500 text-sm text-center py-8">
              <div className="text-3xl mb-2">🔍</div>
              <Link to="/buddies" className="text-primary-400 hover:underline">Find buddies</Link> to get started
            </div>
          ) : (
            <div className="space-y-2.5">
              {buddies.slice(0, 3).map((buddy) => (
                <div key={buddy._id} className="flex items-center gap-3 bg-dark-900/40 rounded-xl p-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                      {buddy.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {buddy.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{buddy.name}</div>
                    <div className="text-dark-500 text-xs">{buddy.city || 'No location'} {buddy.isOnline ? '· Online' : ''}</div>
                  </div>
                  <Link to={`/chat/${buddy._id}`} className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors shrink-0">
                    Chat →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>📊</span> Your Profile
            </h2>
            <Link to="/profile/edit" className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors">
              Edit →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Goal', value: profile?.fitnessGoal?.replace(/_/g, ' ') || 'Not set', icon: '🎯' },
              { label: 'Level', value: profile?.experienceLevel || 'Not set', icon: '📈' },
              { label: 'Time', value: profile?.preferredWorkoutTime || 'Not set', icon: '⏰' },
              { label: 'City', value: profile?.city || 'Not set', icon: '📍' },
            ].map((item) => (
              <div key={item.label} className="bg-dark-900/40 rounded-lg p-3 text-center">
                <div className="text-lg mb-0.5">{item.icon}</div>
                <div className="text-white text-xs font-semibold truncate capitalize">{item.value}</div>
                <div className="text-dark-500 text-[10px] uppercase tracking-wider mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          {(!profile?.fitnessGoal || !profile?.city) && (
            <Link to="/profile/edit" className="block text-center text-primary-400 text-xs mt-3 hover:text-primary-300 transition-colors">
              Complete your profile for better matches →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
