import React, { useState } from 'react';
import UsersManagement from '../components/UsersManagement';
import ClubManagement from '../components/ClubManagement';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button onClick={() => setActiveSection('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveSection('users')}>Users</button>
        <button onClick={() => setActiveSection('clubs')}>Clubs</button>
        <button onClick={() => setIsLoggedIn(false)}>Logout</button>
      </nav>
      
      {activeSection === 'users' && <UsersManagement />}
      {activeSection === 'clubs' && <ClubManagement />}
      {activeSection === 'dashboard' && (
        <div className="admin-content">
          <h2>Admin Dashboard</h2>
          {/* Add your dashboard content here */}
        </div>
      )}
    </div>
  );
};

export default AdminLogin;