// components/PatientHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientHistory = ({ patientId }) => {
  const [patientHistory, setPatientHistory] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: '', doctorId: '', notes: '', prescriptions: [] });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', startDate: '', endDate: '' });

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const response = await axios.get(`/api/patientHistory/${patientId}`);
        setPatientHistory(response.data);
        setAppointments(response.data.appointments);
        setMedicalConditions(response.data.medicalConditions);
        setMedications(response.data.medications);
      } catch (error) {
        console.error('Error fetching patient history:', error);
      }
    };

    fetchPatientHistory();
  }, [patientId]);

  const handleAddAppointment = async () => {
    try {
      const updatedAppointments = [...appointments, newAppointment];
      await axios.post('/api/patientHistory', { patientId, appointments: updatedAppointments, medicalConditions, medications });
      setAppointments(updatedAppointments);
      setNewAppointment({ date: '', doctorId: '', notes: '', prescriptions: [] });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleAddMedication = async () => {
    try {
      const updatedMedications = [...medications, newMedication];
      await axios.post('/api/patientHistory', { patientId, appointments, medicalConditions, medications: updatedMedications });
      setMedications(updatedMedications);
      setNewMedication({ name: '', dosage: '', startDate: '', endDate: '' });
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  return (
    <div>
      <h2>Patient History</h2>
      {patientHistory ? (
        <>
          <h3>Appointments</h3>
          <ul>
            {appointments.map((appt, index) => (
              <li key={index}>
                {appt.date} - Dr. {appt.doctorId} - {appt.notes}
                <ul>
                  {appt.prescriptions.map((prescription, i) => (
                    <li key={i}>{prescription}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <h3>Medical Conditions</h3>
          <ul>
            {medicalConditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>

          <h3>Medications</h3>
          <ul>
            {medications.map((medication, index) => (
              <li key={index}>{medication.name} - {medication.dosage}</li>
            ))}
          </ul>

          <h3>Add Appointment</h3>
          <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
          <input type="text" placeholder="Doctor ID" value={newAppointment.doctorId} onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })} />
          <input type="text" placeholder="Notes" value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} />
          <input type="text" placeholder="Prescriptions" value={newAppointment.prescriptions.join(', ')} onChange={(e) => setNewAppointment({ ...newAppointment, prescriptions: e.target.value.split(',') })} />
          <button onClick={handleAddAppointment}>Add Appointment</button>

          <h3>Add Medication</h3>
          <input type="text" placeholder="Medication Name" value={newMedication.name} onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })} />
          <input type="text" placeholder="Dosage" value={newMedication.dosage} onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })} />
          <input type="date" placeholder="Start Date" value={newMedication.startDate} onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })} />
          <input type="date" placeholder="End Date" value={newMedication.endDate} onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })} />
          <button onClick={handleAddMedication}>Add Medication</button>
        </>
      ) : (
        <p>No patient history found.</p>
      )}
    </div>
  );
};

export default PatientHistory;
