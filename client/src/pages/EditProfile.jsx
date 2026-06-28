import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';

const GOALS = ['weight_loss', 'muscle_gain', 'endurance', 'general_fitness', 'flexibility'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const TIMES = ['morning', 'afternoon', 'evening', 'night'];

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', age: '', gender: '', city: '', fitnessGoal: '',
    experienceLevel: '', preferredWorkoutTime: '', gymName: '', bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProfile();
        setForm({
          name: data.name || '',
          age: data.age || '',
          gender: data.gender || '',
          city: data.city || '',
          fitnessGoal: data.fitnessGoal || '',
          experienceLevel: data.experienceLevel || '',
          preferredWorkoutTime: data.preferredWorkoutTime || '',
          gymName: data.gymName || '',
          bio: data.bio || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      };
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      <h1 className="page-title">Edit Profile</h1>

      <div className="card">
        {message && (
          <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${
            message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" name="age" className="input-field" value={form.age} onChange={handleChange} min="13" max="100" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select name="gender" className="select-field" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input type="text" name="city" className="input-field" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai" />
            </div>
            <div>
              <label className="label">Fitness Goal</label>
              <select name="fitnessGoal" className="select-field" value={form.fitnessGoal} onChange={handleChange}>
                <option value="">Select</option>
                {GOALS.map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select name="experienceLevel" className="select-field" value={form.experienceLevel} onChange={handleChange}>
                <option value="">Select</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preferred Workout Time</label>
              <select name="preferredWorkoutTime" className="select-field" value={form.preferredWorkoutTime} onChange={handleChange}>
                <option value="">Select</option>
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Gym Name</label>
              <input type="text" name="gymName" className="input-field" value={form.gymName} onChange={handleChange} placeholder="e.g. Cult Fit" />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea name="bio" className="input-field" rows="3" value={form.bio} onChange={handleChange} placeholder="Tell potential buddies about yourself..." maxLength="500"></textarea>
            <div className="text-dark-400 text-xs mt-1 text-right">{form.bio.length}/500</div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
