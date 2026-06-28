import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getBuddies } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, buddiesRes] = await Promise.all([getProfile(), getBuddies()]);
        setProfile(profileRes.data);
        setBuddies(buddiesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  const infoItems = [
    { label: 'Email', value: profile?.email, icon: '📧' },
    { label: 'Age', value: profile?.age || 'Not set', icon: '🎂' },
    { label: 'Gender', value: profile?.gender || 'Not set', icon: '👤' },
    { label: 'City', value: profile?.city || 'Not set', icon: '📍' },
    { label: 'Fitness Goal', value: profile?.fitnessGoal?.replace(/_/g, ' ') || 'Not set', icon: '🎯' },
    { label: 'Experience', value: profile?.experienceLevel || 'Not set', icon: '📊' },
    { label: 'Workout Time', value: profile?.preferredWorkoutTime || 'Not set', icon: '⏰' },
    { label: 'Gym', value: profile?.gymName || 'Not set', icon: '🏋️' },
  ];

  return (
    <div className="page-container max-w-4xl">
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
            <p className="text-dark-400 mt-1">{profile?.bio || 'No bio yet'}</p>
            <Link to="/profile/edit" className="btn-primary inline-block mt-4 text-sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {infoItems.map((item) => (
          <div key={item.label} className="card flex items-center gap-4 py-4">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-dark-400 text-xs uppercase tracking-wider">{item.label}</div>
              <div className="text-white font-medium capitalize">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Gym Buddies ({buddies.length})</h2>
        {buddies.length === 0 ? (
          <p className="text-dark-400 text-sm">No buddies yet. <Link to="/buddies" className="text-primary-500 hover:underline">Find some!</Link></p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buddies.map((buddy) => (
              <Link
                key={buddy._id}
                to={`/chat/${buddy._id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-dark-900/50 hover:bg-dark-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {buddy.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{buddy.name}</div>
                  <div className="text-dark-400 text-xs">{buddy.fitnessGoal?.replace('_', ' ') || 'No goal'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
