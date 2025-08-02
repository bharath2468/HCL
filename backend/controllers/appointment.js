const express = require('express');
const Doctor = require('../models/Doctor'); // Import your Doctor model
const Appointment = require('../models/Appointment'); // Import your Appointment model
const Patient = require('../models/Patient');
const nodemailer = require('nodemailer');
const router = express.Router();
router.get('/doctor/schedule/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    // Collect all appointmentIds from the schedule
    const appointmentIds = [];
    doctor.schedule.forEach(day => {
      day.timeSlots.forEach(slot => {
        if (slot.appointmentId) {
          appointmentIds.push(slot.appointmentId);
        }
      });
    });
    if (appointmentIds.length === 0) {
      console.log('Doctor schedule appointmentIds: [] (No appointments scheduled)');
    } else {
      console.log('Doctor schedule appointmentIds:', appointmentIds);
    }
    const appointments = await Appointment.find({ _id: { $in: appointmentIds } }).populate('patientId');
    if (appointments.length === 0) {
      console.log('Doctor schedule appointments: [] (No appointments found for these IDs)');
    } else {
      console.log('Doctor schedule appointments:', appointments);
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error in /doctor/schedule/:doctorId:', error);
    res.status(500).json({ error: 'Error fetching doctor appointments from schedule', details: error.message });
  }
});

// Get all appointments for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId }).populate('patientId');
    console.log('Appointments for doctor:', doctorId, appointments);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor appointments' });
  }
});

// Get details of a specific appointment
router.get('/details/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId).populate('patientId doctorId');
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointment details' });
  }
});

// Update medical diagnosis for a specific appointment
router.put('/diagnosis/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { medicalCondition } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { medicalCondition, status: 'attended' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    // Add new medical history entry to Patient
    const patient = await Patient.findById(appointment.patientId);
    if (patient) {
      patient.medicalHistory.push({
        date: new Date(),
        medicalCondition
      });
      await patient.save();
    }
    // Update patient history in Redis
    const { redisClient } = require('../config/redis');
    const patientId = appointment.patientId.toString();
    // Try to get from patient.medicalHistory if not in Redis
    await redisClient.set(`patient_history:${patientId}`, JSON.stringify(patient.medicalHistory));
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Error updating medical diagnosis' });
  }
});
// ...existing code...

//Updating the Booking
router.post('/book', async (req, res) => {
  console.log('Updating appointment with data:', req.body);
  try {
    const { patientId, doctorId, date, timeSlotId } = req.body;

    if (!patientId || !doctorId || !date || !timeSlotId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doctor = await Doctor.findById(doctorId);
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

    // Create a new appointment object using the request data
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      timeSlot: {
        time: timeSlot.time,
        status: timeSlot.status,
        appointmentId: timeSlot.appointmentId || null
      }
    });
    const bookingdate = new Date(date).toISOString().split('T')[0];
    const bookingtime = timeSlot.time;

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();
    const bookingId = savedAppointment._id;

    // Add appointmentId to the booked time slot
    timeSlot.status = 'Booked';
    timeSlot.appointmentId = bookingId;
    await doctor.save();

    //Send confirmation Mail
    const patient = await Patient.findById(patientId);
    const patientMail = patient.email;

    async function sendEmail(patientMail, bookingId, date, time) {
      // Create a transporter
      const transporter = nodemailer.createTransport({
          service: 'Gmail', // or another service
          auth: {
              user: 'bh3214321@gmail.com', // Your email
              pass: "mbip vqme pnbc wcpb" // Your email password or app-specific password
          }
      });
  
      // Set email options
      const mailOptions = {
          from: 'bh3214321@gmail.com',
          to: `${patientMail}`,
          subject: 'Confirmation of Hospital Appointment',
          text: `Thanks! for booking an appointment with us, here are your appointment details\n\tBooking ID : ${bookingId}\n\tDate : ${date}\n\tTime : ${time}\n Best Regards,\nHospital Management System`
      };
    
      try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
      } catch (error) {
          console.error('Error sending email:', error);
      }
    }
    sendEmail(patientMail, bookingId, bookingdate, bookingtime);

    console.log('Time slot booked successfully');
    res.status(200).json({ message: 'Time slot booked successfully' });
  } catch (error) {
    console.error('Error booking time slot:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const updateData = req.body;
    // Only allow updating medicalCondition, notes, or other allowed fields
    const allowedFields = ['medicalCondition', 'notes', 'date', 'timeSlot'];
    const updateFields = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        updateFields[key] = updateData[key];
      }
    }
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    // Store updated patient history in Redis
    const { redisClient } = require('../config/redis');
    const patientId = appointment.patientId.toString();
    const allAppointments = await Appointment.find({ patientId });
    await redisClient.set(`patient_history:${patientId}`, JSON.stringify(allAppointments));
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