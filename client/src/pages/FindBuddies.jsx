import { useState, useEffect } from 'react';
import { getRecommended, getFilteredUsers, sendRequest, getSentRequests } from '../services/api';

const GOALS = ['', 'weight_loss', 'muscle_gain', 'endurance', 'general_fitness', 'flexibility'];
const LEVELS = ['', 'beginner', 'intermediate', 'advanced'];
const TIMES = ['', 'morning', 'afternoon', 'evening', 'night'];

export default function FindBuddies() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentIds, setSentIds] = useState(new Set());
  const [sending, setSending] = useState(null);
  const [filters, setFilters] = useState({ city: '', fitnessGoal: '', experienceLevel: '', workoutTime: '' });

  useEffect(() => {
    fetchMatches();
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      const { data } = await getSentRequests();
      const pending = data.filter((r) => r.status === 'pending').map((r) => r.receiver._id);
      const accepted = data.filter((r) => r.status === 'accepted').map((r) => r.receiver._id);
      setSentIds(new Set([...pending, ...accepted]));
    } catch {}
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data } = await getRecommended();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.fitnessGoal) params.fitnessGoal = filters.fitnessGoal;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
      if (filters.workoutTime) params.workoutTime = filters.workoutTime;
      if (Object.values(params).some(Boolean)) {
        const { data } = await getFilteredUsers(params);
        setMatches(data);
      } else {
        fetchMatches();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId) => {
    setSending(receiverId);
    try {
      await sendRequest(receiverId);
      setSentIds((prev) => new Set([...prev, receiverId]));
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request');
    } finally {
      setSending(null);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBadge = (status) => {
    if (status === 'accepted') return { text: 'Buddies', class: 'bg-green-500/10 text-green-400 border border-green-500/30' };
    if (status === 'pending') return { text: 'Pending', class: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' };
    return null;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Find Gym Buddies</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="City"
            className="input-field text-sm"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <select className="select-field text-sm" value={filters.fitnessGoal} onChange={(e) => setFilters({ ...filters, fitnessGoal: e.target.value })}>
            <option value="">All Goals</option>
            {GOALS.filter(Boolean).map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
          </select>
          <select className="select-field text-sm" value={filters.experienceLevel} onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}>
            <option value="">All Levels</option>
            {LEVELS.filter(Boolean).map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className="select-field text-sm" value={filters.workoutTime} onChange={(e) => setFilters({ ...filters, workoutTime: e.target.value })}>
            <option value="">All Times</option>
            {TIMES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn-primary mt-3 text-sm" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-white font-semibold mb-2">No matches found</h3>
          <p className="text-dark-400 text-sm">Try adjusting your filters or complete your profile for better recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => {
            const badge = getBadge(match.requestStatus);
            return (
              <div key={match.user._id} className="card hover:border-primary-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg">
                      {match.user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{match.user.name}</h3>
                      <p className="text-dark-400 text-xs">{match.user.city || 'Location not set'}</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getMatchColor(match.compatibilityScore)}`}>
                    {match.compatibilityScore}%
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">Goal Match (40%)</span>
                    <span className={`font-medium ${match.breakdown.fitnessGoal === 40 ? 'text-green-500' : 'text-dark-300'}`}>
                      {match.breakdown.fitnessGoal}/40
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">Time Match (30%)</span>
                    <span className={`font-medium ${match.breakdown.workoutTime === 30 ? 'text-green-500' : 'text-dark-300'}`}>
                      {match.breakdown.workoutTime}/30
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">Level Match (20%)</span>
                    <span className={`font-medium ${match.breakdown.experienceLevel === 20 ? 'text-green-500' : 'text-dark-300'}`}>
                      {match.breakdown.experienceLevel}/20
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">City Match (10%)</span>
                    <span className={`font-medium ${match.breakdown.city === 10 ? 'text-green-500' : 'text-dark-300'}`}>
                      {match.breakdown.city}/10
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.user.fitnessGoal && (
                    <span className="bg-primary-500/10 text-primary-400 text-xs px-3 py-1 rounded-full capitalize border border-primary-500/20">
                      {match.user.fitnessGoal.replace('_', ' ')}
                    </span>
                  )}
                  {match.user.experienceLevel && (
                    <span className="bg-dark-700 text-dark-200 text-xs px-3 py-1 rounded-full capitalize">
                      {match.user.experienceLevel}
                    </span>
                  )}
                  {match.user.preferredWorkoutTime && (
                    <span className="bg-dark-700 text-dark-200 text-xs px-3 py-1 rounded-full capitalize">
                      {match.user.preferredWorkoutTime}
                    </span>
                  )}
                </div>

                {badge ? (
                  <span className={`block text-center text-sm font-medium py-2 rounded-lg ${badge.class}`}>
                    {badge.text}
                  </span>
                ) : (
                  <button
                    className="btn-primary w-full text-sm"
                    onClick={() => handleSendRequest(match.user._id)}
                    disabled={sending === match.user._id}
                  >
                    {sending === match.user._id ? 'Sending...' : 'Send Buddy Request'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
