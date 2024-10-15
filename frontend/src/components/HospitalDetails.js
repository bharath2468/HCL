import React from 'react';
import authService from '../services/authService';
import Chatbot from './Chatbot';
import '../styles/HospitalDetails.css';

const HospitalDetails = ({ role }) => {
  const user = authService.getCurrentUser();
  const doctor = authService.getCurrentDoctor();
  const isDoctor = role === 'doctor';
    console.log(process.env.GEMINI_API);
  return (
    <div className="hospital-container">
      
      <h2 className="dashboard-title">Dashboard</h2>
      
      <div className="hospital-card">
        <h3>Hospital Details</h3>
        <div className="hospital-info">
          <p><strong>Name:</strong> {user ? user.name : 'Guest'}</p>
          <p><strong>Address:</strong> {user ? user.address : 'Guest'}</p>
          <p><strong>Email:</strong> {user ? user.email : 'Guest'}</p>
          <p><strong>Contact:</strong> {user ? user.contact : 'Guest'}</p>
        </div>
      </div>

      {isDoctor && (
        <div className="doctor-card">
          <h3>Doctor Details</h3>
          <div className="doctor-info">
            <p><strong>First Name:</strong> {doctor ? doctor.firstname : 'N/A'}</p>
            <p><strong>Last Name:</strong> {doctor ? doctor.lastname : 'N/A'}</p>
            <p><strong>Email:</strong> {doctor ? doctor.email : 'N/A'}</p>
            <p><strong>Contact:</strong> {doctor ? doctor.contact : 'N/A'}</p>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default HospitalDetails;
