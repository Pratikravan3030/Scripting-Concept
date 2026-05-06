import { useState, useEffect } from 'react';
import api from '../api';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [vacationActive, setVacationActive] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
        if (res.data.vacationMode) {
          setVacationActive(res.data.vacationMode.isActive);
          if (res.data.vacationMode.startDate) {
            setStartDate(new Date(res.data.vacationMode.startDate).toISOString().split('T')[0]);
          }
          if (res.data.vacationMode.endDate) {
            setEndDate(new Date(res.data.vacationMode.endDate).toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        vacationMode: {
          isActive: vacationActive,
          startDate: vacationActive && startDate ? new Date(startDate) : null,
          endDate: vacationActive && endDate ? new Date(endDate) : null,
        }
      };
      await api.put('/users/settings', payload);
      setMessage('Settings saved successfully!');
    } catch (err) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Settings & Profile</h1>
      
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="avatar large">{user.username.charAt(0).toUpperCase()}</div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{user.username}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '0.5rem' }}>Vacation Mode 🏖️</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Pause streak penalties while you're away. You won't lose points for missed days.
        </p>

        <form onSubmit={handleSave}>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={vacationActive} 
                onChange={(e) => setVacationActive(e.target.checked)}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
              />
              <span style={{ color: '#fff', fontWeight: 600 }}>Enable Vacation Mode</span>
            </label>
          </div>

          {vacationActive && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  required
                />
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {message && <span style={{ marginLeft: '1rem', color: message.includes('Error') ? 'var(--danger)' : 'var(--accent)' }}>{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
