import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust the URL based on your backend server

// Login function
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Signup function
const signup = async (userData) => {
  try {
    console.log(userData)
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error('Signup failed');
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default authService;
