import { useState, useEffect } from 'react';
import api from '../api';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await api.get('/habits');
        setHabits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  if (loading) {
    return <div className="container"><p>Loading analytics...</p></div>;
  }

  // Calculate radar data
  const categoryCounts = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + (habit.completions?.length || 0);
    return acc;
  }, {});

  const radarData = {
    labels: Object.keys(categoryCounts).length ? Object.keys(categoryCounts) : ['General'],
    datasets: [
      {
        label: 'Habit Completions',
        data: Object.keys(categoryCounts).length ? Object.values(categoryCounts) : [0],
        backgroundColor: 'rgba(236, 72, 153, 0.2)', // Pink transparent
        borderColor: '#ec4899',
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6', // Purple
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8b5cf6'
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#f8fafc', font: { size: 14, family: 'Outfit' } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Generate Stats and Heatmap Data
  const allCompletions = new Set();
  const allFailures = new Set();
  
  let totalCompletions = 0;
  let totalMisses = 0;
  let topStreak = 0;

  habits.forEach(h => {
    if (h.currentStreak > topStreak) topStreak = h.currentStreak;
    if (h.completions) {
      totalCompletions += h.completions.length;
      h.completions.forEach(c => allCompletions.add(new Date(c).toISOString().split('T')[0]));
    }
    if (h.failures) {
      totalMisses += h.failures.length;
      h.failures.forEach(f => allFailures.add(new Date(f).toISOString().split('T')[0]));
    }
  });

  // Calculate Global Streak (consecutive days backward)
  let globalStreak = 0;
  let streakDates = new Set();
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  let checkDate = new Date();
  if (!allCompletions.has(todayStr)) {
      if (allCompletions.has(yesterdayStr)) {
          checkDate = yesterdayDate;
      }
  }

  while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (allCompletions.has(dStr)) {
          globalStreak++;
          streakDates.add(dStr);
          checkDate.setDate(checkDate.getDate() - 1);
      } else {
          break;
      }
  }

  // Generate simple heatmap (last 180 days)
  const heatmapCells = [];
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 179; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    let cellClass = '';
    let title = `${dateStr} - No Data`;
    
    if (streakDates.has(dateStr)) {
      cellClass = 'active streak-active';
      title = `${dateStr} - Completed (Streak 🔥)`;
    } else if (allCompletions.has(dateStr)) {
      cellClass = 'active';
      title = `${dateStr} - Completed`;
    } else if (allFailures.has(dateStr)) {
      cellClass = 'missed';
      title = `${dateStr} - Missed`;
    }

    heatmapCells.push(
      <div 
        key={dateStr} 
        className={`heatmap-cell ${cellClass}`}
        title={title}
      />
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Analytics Vault</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Completions</h3>
          <div className="value">{totalCompletions}</div>
        </div>
        <div className="stat-card">
          <h3>Missed Tasks</h3>
          <div className="value" style={{ background: 'var(--danger)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{totalMisses}</div>
        </div>
        <div className="stat-card">
          <h3>Global Streak</h3>
          <div className="value">{globalStreak} 🔥</div>
        </div>
        <div className="stat-card">
          <h3>Top Active Streak</h3>
          <div className="value">{topStreak}</div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Category Balance</h2>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            {habits.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Not enough data yet.</p>
            ) : (
              <Radar data={radarData} options={radarOptions} />
            )}
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ marginBottom: '0.5rem' }}>Consistency Heatmap</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Last 180 Days Overview</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="heatmap-cell active streak-active" style={{ width: '14px' }}></div> Active Streak</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="heatmap-cell active" style={{ width: '14px' }}></div> Completed</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="heatmap-cell missed" style={{ width: '14px' }}></div> Missed</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="heatmap-cell" style={{ width: '14px' }}></div> No Data</div>
          </div>
          
          <div className="heatmap-grid">
            {heatmapCells}
          </div>
        </div>
      </div>
    </div>
  );
}
