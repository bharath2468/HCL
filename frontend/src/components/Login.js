import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to 'admin'
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.login({ email, password, role });
      console.log(role)
      navigate('/dashboard', { state: { role } });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input 
            type="radio" 
            value="admin" 
            checked={role === 'admin'} 
            onChange={() => setRole('admin')} 
          />
          Hospital Admin
        </label>
        <label>
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={role === 'admin' ? 'Admin Email' : 'Doctor Email'}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">
        {role === 'admin' ? 'Login as Admin' : 'Login as Doctor'}
      </button>
    </form>
  );
}

export default Login;
