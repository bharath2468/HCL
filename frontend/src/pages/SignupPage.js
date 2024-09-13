import React from 'react';
import AuthForm from '../components/AuthForm';
import { register } from '../services/authService';

const SignupPage = () => {
  const handleSignup = async (formData) => {
    try {
      const { name, address, contact,  email, password } = formData;
      await register(name,address, contact,  email, password);
      alert('Signup successful! You can now login.');
    } catch (error) {
      console.error(error);
      alert('Error during signup!');
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <AuthForm onSubmit={handleSignup} title="Signup" />
    </div>
  );
};

export default SignupPage;
