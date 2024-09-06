import React from 'react';
import authService from '../services/authService';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user ? user.name : 'Guest'}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
