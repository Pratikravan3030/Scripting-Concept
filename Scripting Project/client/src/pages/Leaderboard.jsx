import { useState, useEffect } from 'react';
import api from '../api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Global Leaderboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        See how you stack up against the most consistent members.
      </p>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading rankings...</div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
                <th>Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u._id} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="rank-col">
                    {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="user-col">
                    <div className="user-info">
                      <div className="avatar small">{u.username.charAt(0).toUpperCase()}</div>
                      {u.username}
                    </div>
                  </td>
                  <td className="points-col">{u.totalPoints} <span style={{ color: 'var(--accent)' }}>⚡</span></td>
                  <td className="badges-col">
                    {u.milestones && u.milestones.map(m => (
                      <span key={m.name} className="badge-pill" title={new Date(m.achievedAt).toLocaleDateString()}>
                        ⭐
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
