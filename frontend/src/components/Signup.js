import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // Adding a new CSS file for signup-specific styles

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    password: '',
  });

  const { name, address, contact, email, password } = formData;
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
      console.log(error);
      alert('Error registering user!');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <form onSubmit={onSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Name"
            onChange={onChange}
            className="signup-input"
          />
          <input
            type="text"
            name="address"
            value={address}
            placeholder="Address"
            onChange={onChange}
            className="signup-input"
          />
          <input
            type="text"
            name="contact"
            value={contact}
            placeholder="Contact"
            onChange={onChange}
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={onChange}
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={onChange}
            className="signup-input"
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
