import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL based on your backend server

// Login function
const login = async (credentials) => {
  try {
    if (credentials.role==='admin'){
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    }
    else{
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log(response.data)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('doctor', JSON.stringify(response.data.doctor));
      }
      return response.data;
    }
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Signup function
const signup = async (userData) => {
  try {
    console.log(userData);
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error('Signup failed');
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('doctor');
};

// Get current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Get current doctor
const getCurrentDoctor = () => {
  return JSON.parse(localStorage.getItem('doctor'));
};

// Create patient function
const createPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_URL}/patients`, patientData, {
      headers: {
        'Authorization': `Bearer ${getCurrentUser()?.token}` // Add auth token if needed
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Creating patient failed');
  }
};

// Book appointment function
const bookAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
      headers: {
        'Authorization': `Bearer ${getCurrentUser()?.token}` // Add auth token if needed
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Booking appointment failed');
  }
};

// Create doctor function
const createDoctor = async (doctorData) => {
  try {
    const response = await axios.post(`${API_URL}/doctors`, doctorData, {
      headers: {
        'Authorization': `Bearer ${getCurrentUser()?.token}` // Add auth token if needed
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Creating doctor failed');
  }
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
  getCurrentDoctor,
  createPatient,
  bookAppointment,
  createDoctor,
};

export default authService;
