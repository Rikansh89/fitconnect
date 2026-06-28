import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingRequests, respondToRequest, getBuddies, removeBuddy } from '../services/api';

export default function BuddyRequests() {
  const [pending, setPending] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, buddiesRes] = await Promise.all([getPendingRequests(), getBuddies()]);
      setPending(pendingRes.data);
      setBuddies(buddiesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, status) => {
    try {
      await respondToRequest(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (buddyId) => {
    if (!confirm('Remove this buddy?')) return;
    try {
      await removeBuddy(buddyId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Buddy Requests</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'buddies'].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-300 hover:text-white'
            }`}
            onClick={() => setTab(t)}
          >
            {t === 'pending' ? `Pending (${pending.length})` : `Buddies (${buddies.length})`}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <>
          {pending.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-white font-semibold mb-2">No pending requests</h3>
              <p className="text-dark-400 text-sm">When someone sends you a buddy request, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((req) => (
                <div key={req._id} className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg">
                    {req.sender?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{req.sender?.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {req.sender?.city && <span className="text-dark-400 text-xs">📍 {req.sender.city}</span>}
                      {req.sender?.fitnessGoal && <span className="text-dark-400 text-xs">🎯 {req.sender.fitnessGoal.replace('_', ' ')}</span>}
                      {req.sender?.experienceLevel && <span className="text-dark-400 text-xs">📊 {req.sender.experienceLevel}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="btn-primary text-xs px-4" onClick={() => handleRespond(req._id, 'accepted')}>
                      Accept
                    </button>
                    <button className="btn-danger text-xs px-4" onClick={() => handleRespond(req._id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'buddies' && (
        <>
          {buddies.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white font-semibold mb-2">No buddies yet</h3>
              <p className="text-dark-400 text-sm">Find gym buddies on the Find Buddies page!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {buddies.map((buddy) => (
                <div key={buddy._id} className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-lg">
                    {buddy.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{buddy.name}</h3>
                    <p className="text-dark-400 text-xs">{buddy.city || 'No location'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {buddy.isOnline && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                      <span className="text-dark-400 text-xs">{buddy.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/chat/${buddy._id}`} className="btn-primary text-xs px-3">Chat</Link>
                    <button className="btn-danger text-xs px-3" onClick={() => handleRemove(buddy._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
