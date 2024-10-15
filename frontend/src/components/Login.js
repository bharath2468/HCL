import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css'; // Adding a new CSS file for login-specific styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to 'admin'
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.login({ email, password, role });
      console.log(role);
      navigate('/dashboard', { state: { role } });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-role">
            <label className={role === 'admin' ? 'active-role' : ''}>
              <input 
                type="radio" 
                value="admin" 
                checked={role === 'admin'} 
                onChange={() => setRole('admin')} 
              />
              Hospital Admin
            </label>
            <label className={role === 'doctor' ? 'active-role' : ''}>
              <input 
                type="radio" 
                value="doctor" 
                checked={role === 'doctor'} 
                onChange={() => setRole('doctor')} 
              />
              Doctor
            </label>
          </div>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === 'admin' ? 'Admin Email' : 'Doctor Email'}
            required
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="login-button">
            {role === 'admin' ? 'Login as Admin' : 'Login as Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
