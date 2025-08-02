import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chatbot from './Chatbot';

const AppointmentDetails = ({ appointmentId }) => {
  const [appointment, setAppointment] = useState(null);
  const [medicalCondition, setMedicalCondition] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/details/${appointmentId}`);
        setAppointment(res.data);
        setMedicalCondition(res.data.medicalCondition || '');
      } catch (err) {
        setError('Failed to fetch appointment details');
      }
    };
    if (appointmentId) fetchDetails();
  }, [appointmentId]);

  // Mark appointment as attended and store medical history in patient DB
  const handleAttend = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Update appointment status and diagnosis
      await axios.put(`http://localhost:5000/api/appointments/diagnosis/${appointmentId}`, { medicalCondition, status: 'attended' });
      // Store medical history in patient DB
      await axios.post(`http://localhost:5000/api/patients/addHistory`, {
        patientId: appointment.patientId?._id || appointment.patientId,
        date: appointment.date,
        diagnosis: medicalCondition
      });
      setSuccess(true);
      // Optionally, refresh appointment details
      const res = await axios.get(`http://localhost:5000/api/appointments/details/${appointmentId}`);
      setAppointment(res.data);
    } catch (err) {
      setError('Failed to mark as attended or save history');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.put(`http://localhost:5000/api/appointments/diagnosis/${appointmentId}`, { medicalCondition });
      setSuccess(true);
    } catch (err) {
      setError('Failed to save medical diagnosis');
    } finally {
      setSaving(false);
    }
  };

  if (!appointment) return <div>Loading appointment details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Appointment Details</h2>
      <p><strong>Date:</strong> {appointment.date ? new Date(appointment.date).toLocaleDateString() : ''}</p>
      <p><strong>Patient:</strong> {
        appointment.patientId && typeof appointment.patientId === 'object'
          ? `${appointment.patientId.firstName || ''} ${appointment.patientId.lastName || ''}`.trim() || `Patient ID: ${appointment.patientId._id}`
          : typeof appointment.patientId === 'string'
            ? appointment.patientId
            : 'Unknown Patient'
      }</p>
      <p><strong>Doctor:</strong> {
        appointment.doctorId && typeof appointment.doctorId === 'object'
          ? `${appointment.doctorId.firstName || ''} ${appointment.doctorId.lastName || ''}`.trim() || `Doctor ID: ${appointment.doctorId._id}`
          : typeof appointment.doctorId === 'string'
            ? appointment.doctorId
            : 'Unknown Doctor'
      }</p>
      <p><strong>Status:</strong> <span style={{ color: appointment.status === 'attended' ? 'green' : appointment.status === 'closed' ? 'gray' : 'orange' }}>{typeof appointment.status === 'string' ? appointment.status : 'Pending'}</span></p>
      <p><strong>Current Medical Diagnosis:</strong> {appointment.medicalCondition || 'None'}</p>
      <textarea
        value={medicalCondition}
        onChange={e => setMedicalCondition(e.target.value)}
        placeholder="Add or update medical diagnosis"
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Diagnosis'}
      </button>
      <button onClick={handleAttend} disabled={saving} style={{ marginLeft: '12px', background: '#4caf50', color: 'white' }}>
        {saving ? 'Processing...' : 'Mark as Attended'}
      </button>
      {success && <p style={{ color: 'green' }}>Diagnosis saved and history updated!</p>}
      {/* Show Chatbot for this patient */}
      <div style={{ marginTop: '32px' }}>
        <Chatbot patientId={appointment.patientId?._id || appointment.patientId} />
      </div>
    </div>
  );
};

export default AppointmentDetails;
