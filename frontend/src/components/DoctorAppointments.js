import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAppointments = ({ doctorId, onSelectAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('DoctorAppointments mounted. doctorId:', doctorId);
    if (!doctorId) {
      console.log('No doctorId provided.');
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/api/appointments/doctor/schedule/${doctorId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched appointments:', data);
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch appointments');
        setLoading(false);
      });
  }, [doctorId]);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>{error}</div>;

  if (appointments.length === 0) return <div>No appointments found.</div>;

  return (
    <div>
      <h2>My Appointments</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {Array.isArray(appointments) && appointments.map(app => {
          let patientName = 'Unknown Patient';
          if (app.patientId && typeof app.patientId === 'object') {
            if (app.patientId.firstName || app.patientId.lastName) {
              patientName = `${app.patientId.firstName || ''} ${app.patientId.lastName || ''}`.trim();
            } else if (app.patientId._id) {
              patientName = `Patient ID: ${app.patientId._id}`;
            }
          } else if (typeof app.patientId === 'string') {
            patientName = app.patientId;
          }
          // Only render safe fields, never objects
          const dateStr = app.date ? new Date(app.date).toLocaleDateString() : '';
          const timeStr = app.timeSlot && typeof app.timeSlot === 'object' ? (app.timeSlot.time || '') : (typeof app.timeSlot === 'string' ? app.timeSlot : '');
          const statusStr = typeof app.status === 'string' ? app.status : 'Pending';
          return (
            <div
              key={app._id}
              style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '250px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onClick={() => onSelectAppointment(app._id)}
            >
              <h3>{patientName}</h3>
              <p><strong>Date:</strong> {dateStr}</p>
              <p><strong>Time:</strong> {timeStr}</p>
              <p><strong>Status:</strong> {statusStr}</p>
              {/* Only card click opens details, no Attend button here */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorAppointments;
