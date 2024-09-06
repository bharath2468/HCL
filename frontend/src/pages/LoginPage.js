import React from 'react';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const LoginPage = () => {
  const handleLogin = async (formData) => {
    try {
      const { email, password } = formData;
      await authService.login(email, password);
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      alert('Error during login!');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} title="Login" />
    </div>
  );
};

export default LoginPage;
