import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.signup(formData);
      alert('User registered successfully!');
      navigate('/login');
    } catch (error) {
      alert('Error registering user!');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Name"
          onChange={onChange}
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
