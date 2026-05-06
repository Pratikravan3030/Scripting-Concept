import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ setAuth }) {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      // 1. Fetch habits (this also triggers the penalty engine on backend)
      const habitsRes = await api.get('/habits');
      setHabits(habitsRes.data);

      // 2. Fetch weekly report data
      const reportRes = await api.get('/habits/report/weekly');
      setTotalPoints(reportRes.data.totalPoints);
      
      setChartData({
        labels: reportRes.data.dates,
        datasets: [
          {
            label: 'Points',
            data: reportRes.data.points,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ec4899',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#ec4899'
          }
        ]
      });

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName) return;
    try {
      await api.post('/habits', { name: newHabitName });
      setNewHabitName('');
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async (habitId) => {
    try {
      await api.post(`/habits/${habitId}/checkin`);
      fetchData(); // Refresh points and chart
    } catch (err) {
      alert(err.response?.data?.message || 'Error checking in');
    }
  };

  const handleMissed = async (habitId) => {
    try {
      await api.post(`/habits/${habitId}/missed`);
      fetchData(); // Refresh points and chart
    } catch (err) {
      alert(err.response?.data?.message || 'Error marking as missed');
    }
  };

  const handleDelete = async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const canActionToday = (habit) => {
    const now = new Date();
    
    // Check if checked in today
    if (habit.lastChecked) {
      const last = new Date(habit.lastChecked);
      if (last.toDateString() === now.toDateString()) return false;
    }
    
    // Check if explicitly failed today
    if (habit.failures && habit.failures.length > 0) {
      const lastFail = new Date(habit.failures[habit.failures.length - 1]);
      if (lastFail.toDateString() === now.toDateString()) return false;
    }
    
    return true;
  };

  const getActionStatus = (habit) => {
    const now = new Date();
    
    if (habit.lastChecked) {
      const last = new Date(habit.lastChecked);
      if (last.toDateString() === now.toDateString()) return 'Done';
    }
    
    if (habit.failures && habit.failures.length > 0) {
      const lastFail = new Date(habit.failures[habit.failures.length - 1]);
      if (lastFail.toDateString() === now.toDateString()) return 'Missed';
    }
    
    return 'Pending';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Points Over Time (Last 7 Days)',
        color: '#f8fafc',
        font: {
          family: 'Outfit',
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="container">
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Hello, {user.username} 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ready to crush your goals today?</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="points-badge">
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            {totalPoints} pts
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Your Habits</h2>
          
          <form onSubmit={handleAddHabit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Read 10 pages" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              style={{ marginBottom: 0 }}
            />
            <button type="submit" className="btn">Add</button>
          </form>

          <div className="habits-list">
            {habits.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No habits yet. Create one to get started!</p>
            ) : (
              habits.map(habit => {
                const actionStatus = getActionStatus(habit);
                const isPending = actionStatus === 'Pending';
                
                return (
                  <div className="habit-item" key={habit._id}>
                    <div className="habit-info">
                      <h3>{habit.name}</h3>
                      <div className="streak">
                        🔥 {habit.currentStreak} day streak
                      </div>
                    </div>
                    <div className="habit-actions">
                      {isPending ? (
                        <>
                          <button className="btn btn-accent animate-pop" onClick={() => handleCheckIn(habit._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            ✓ Check In
                          </button>
                          <button className="btn btn-warning animate-pop" onClick={() => handleMissed(habit._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            ⚠️ Not Done
                          </button>
                        </>
                      ) : (
                        <button className="btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed', padding: '0.5rem 1rem', fontSize: '0.875rem', background: actionStatus === 'Missed' ? 'var(--danger)' : '' }}>
                          {actionStatus}
                        </button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(habit._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Weekly Progress</h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading chart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
