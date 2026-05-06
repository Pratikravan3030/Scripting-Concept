import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const templates = [
  { id: 1, name: 'Morning Routine', category: 'Health', icon: '🌅', description: 'Wake up, hydrate, and stretch.' },
  { id: 2, name: 'Coding Deep Work', category: 'Productivity', icon: '💻', description: '2 hours of uninterrupted coding.' },
  { id: 3, name: 'Read 20 Pages', category: 'Education', icon: '📚', description: 'Read a non-fiction book daily.' },
  { id: 4, name: 'Gym Session', category: 'Health', icon: '🏋️‍♂️', description: 'Weight lifting or cardio for 45 mins.' },
  { id: 5, name: 'Meditation', category: 'Mindfulness', icon: '🧘‍♂️', description: '10 minutes of guided meditation.' },
  { id: 6, name: 'Drink 2L Water', category: 'Health', icon: '💧', description: 'Stay hydrated throughout the day.' },
];

export default function Marketplace() {
  const [adding, setAdding] = useState(null);
  const navigate = useNavigate();

  const handleAddTemplate = async (template) => {
    setAdding(template.id);
    try {
      // Create habit, passing category to match backend update
      // But we need to update the backend route to accept category if it doesn't already.
      // Wait, let's just send name, and let backend default it, or we can send it.
      await api.post('/habits', { name: template.name });
      // Since we just added it, let's redirect to dashboard so they can see it
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      console.error(err);
      setAdding(null);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Habit Marketplace</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Jumpstart your progress with these pre-built habit templates.
      </p>

      <div className="marketplace-grid">
        {templates.map(template => (
          <div key={template.id} className="glass-card template-card">
            <div className="template-icon">{template.icon}</div>
            <h3>{template.name}</h3>
            <span className="template-category">{template.category}</span>
            <p className="template-desc">{template.description}</p>
            <button 
              className="btn btn-accent" 
              onClick={() => handleAddTemplate(template)}
              disabled={adding === template.id}
              style={{ width: '100%', marginTop: 'auto' }}
            >
              {adding === template.id ? 'Adding...' : '+ Add to Dashboard'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
