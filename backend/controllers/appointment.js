// appointmentRoutes.js

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Import your Doctor model
const Appointment = require('../models/Appointment'); // Import your Appointment model

//Updating the Booking
router.post('/book', async (req, res) => {
  console.log("1")
  console.log('Updating appointment with data:', req.body);
  try {
    const { doctorId, date, timeSlotId } = req.body;
    console.log(req.body)

    if (!doctorId || !date || !timeSlotId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    console.log(doctor)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const schedule = doctor.schedule.find(day => day.date.toISOString().split('T')[0] === date);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found for the given date' });
    }

    const timeSlot = schedule.timeSlots.id(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    timeSlot.status = 'Booked';
    await doctor.save();

    console.log('Time slot booked successfully');
    res.status(200).json({ message: 'Time slot booked successfully' });
  } catch (error) {
    console.error('Error booking time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new appointment
router.get('/appointments/hi', async (req, res) => {
  try {
    //const newAppointment = new Appointment(req.body);
    //await newAppointment.save();
    console.log("3")
    res.status(200).json({message: "Good luck"});
  } catch (error) {
    res.status(400).json({ error: 'Error creating appointment' });
  }
}); 

// Get all appointments
router.get('/appointment', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointment' });
  }
});

// Update an appointment
router.put('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Error updating appointment' });
  }
});

// Delete an appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

module.exports = router;
