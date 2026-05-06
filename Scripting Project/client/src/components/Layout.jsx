import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ setAuth }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar glass-card">
        <div className="sidebar-brand">
          <span style={{ fontSize: '1.5rem' }}>✨</span>
          <h2>Habit Tracker</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Dashboard
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Analytics Vault
          </NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Marketplace
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Leaderboard
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user.username?.charAt(0).toUpperCase()}</div>
            <span>{user.username}</span>
          </div>
          <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
