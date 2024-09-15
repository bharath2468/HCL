import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDoctorAvailability, getAvailableDoctors } from './availability';
import '../styles/Appointment.css';

const Appointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientType, setPatientType] = useState('existing'); // new state for patient type
  const [patientId, setPatientId] = useState('');
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      const availableDoctors = await getAvailableDoctors();
      setDoctors(availableDoctors);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      const fetchAvailability = async () => {
        const availability = await getDoctorAvailability(selectedDoctor);
        const dates = Object.keys(availability).map((dateStr) => new Date(dateStr));
        setAvailableDates(dates);
      };
      fetchAvailability();
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchTimeSlots = async () => {
        const availability = await getDoctorAvailability(selectedDoctor);
        const dateStr = selectedDate.toISOString().split('T')[0];
        setAvailableTimeSlots(availability[dateStr] || []);
      };
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment booked:', {
      doctor: selectedDoctor,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      patient: patientType === 'existing' ? { id: patientId } : newPatientData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h2>Book an Appointment</h2>

      <div className="form-group">
        <label>Patient Type:</label>
        <div className="patient-type">
            <label>
                <input
                    type="radio"
                    value="new"
                    checked={patientType === 'new'}
                    onChange={() => setPatientType('new')}
                />
                New Patient
            </label>
            <label>
                <input
                    type="radio"
                    value="existing"
                    checked={patientType === 'existing'}
                    onChange={() => setPatientType('existing')}
                />
                Existing Patient
            </label>
        </div>
      </div>

      {patientType === 'existing' ? (
        <div className="form-group">
          <label htmlFor="patientId">Patient ID:</label>
          <input
            id="patientId"
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
        </div>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              id="name"
              type="text"
              value={newPatientData.name}
              onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={newPatientData.email}
              onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="tel"
              value={newPatientData.phone}
              onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="doctor">Select Doctor:</label>
        <select id="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
          <option value="">-- Select a doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Select Date:</label>
        <DatePicker
          id="date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          includeDates={availableDates}
          dateFormat="yyyy-MM-dd"
          placeholderText="Pick a date"
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Select Time Slot:</label>
        <select
          id="time"
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          required
          disabled={!selectedDate}
        >
          <option value="">-- Select a time slot --</option>
          {availableTimeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={!selectedDoctor || !selectedDate || !selectedTimeSlot}>
        Book Appointment
      </button>
    </form>
  );
};

export default Appointment;
