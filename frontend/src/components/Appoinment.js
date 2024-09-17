import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDoctorAvailability, getAvailableDoctors, getPatient, bookAppointment} from './availability';  // Assuming these are your API functions
import '../styles/Appointment.css';

const demoPatients = await getPatient();
console.log(demoPatients)

const Appointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientId, setPatientId] = useState('');
  const [matchingPatients, setMatchingPatients] = useState([]);

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
        try {
          // Fetch the availability data for the selected doctor
          const { schedule } = await getDoctorAvailability(selectedDoctor);
    
          // Extract dates from the schedule array
          const dates = schedule.map(entry => new Date(entry.date).toDateString());
    
          // Set the available dates in your state
          setAvailableDates(dates);
        } catch (error) {
          console.error("Failed to fetch doctor availability", error);
          // Optionally handle the error, e.g., set an error state
        }
      };
    
      fetchAvailability();
    }
  }, [selectedDoctor]);
  
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchTimeSlots = async () => {
        try {
          // Fetch the availability data for the selected doctor
          const { schedule } = await getDoctorAvailability(selectedDoctor);
    
          // Format the selectedDate to match the format in the schedule array
          const dateStr = selectedDate.toISOString().split('T')[0];
          console.log(dateStr)
          // Find the schedule entry that matches the selectedDate
          const entry = schedule.find((item) => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            return itemDate === dateStr;
          });
    
          // Set the time slots for the selected date, or an empty array if no match
          setAvailableTimeSlots(entry ? entry.timeSlots : []);
        } catch (error) {
          console.error("Failed to fetch time slots", error);
          // Optionally handle the error, e.g., set an error state
        }
      };
    
      fetchTimeSlots();
    }
    
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    const fetchMatchingPatients = () => {
      setMatchingPatients(demoPatients);
      console.log(matchingPatients)

      const lowerCasePatientId = patientId.toLowerCase();
      const filteredPatients = demoPatients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(lowerCasePatientId)
      );
      setMatchingPatients(filteredPatients);
    };

    fetchMatchingPatients();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const appointmentData = {'doctorId':selectedDoctor,'date':dateStr,'timeSlotId': selectedTimeSlot}
      // Book the appointment
      const appointmentResponse = await bookAppointment(appointmentData);
      

      if (appointmentResponse) {
        alert('Appointment booked successfully!');
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('There was an error booking the appointment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h2>Book an Appointment</h2>

      <div className="form-group">
        <label htmlFor="patientId">Patient ID:</label>
        <input
          id="patientId"
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          list="patients"
          required
        />
        <datalist id="patients">
          {matchingPatients.map(patient => (
            <option key={patient._id} value={`${patient.firstName} ${patient.lastName}`}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </datalist>
      </div>

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
        disabled={!selectedDate || availableTimeSlots.length === 0}
      >
        <option value="" disabled>
          -- Select a time slot --
        </option>
        {availableTimeSlots.length > 0 ? (
          availableTimeSlots.map((slot) => (
            <option key={slot._id} value={slot._id}>
              {slot.time} - {slot.status}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No time slots available
          </option>
        )}
      </select>
    </div>

      <button type="submit" disabled={!selectedDoctor || !selectedDate || !selectedTimeSlot}>
        Book Appointment
      </button>
    </form>
  );
};

export default Appointment;
