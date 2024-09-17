// doctorRoutes.js

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Import your Doctor model

// Create a new doctor
router.post('/create', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ error: 'Error creating doctor' });
  }
});

// Get all doctors
router.get('/get', async (req, res) => {
  try {
    // Await the result from the database query
    const doctors = await Doctor.find({}, '_id firstName lastName');

    // Format the result
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id,
      name: `${doctor.firstName} ${doctor.lastName}`
    }));

    // Send the formatted result as JSON response
    return res.status(200).json(formattedDoctors);
  } catch (error) {
    // Log the error
    console.error('Error fetching doctors:', error);
  };
});

// Get doctor by ID
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor' });
  }
});

// Delete a doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting doctor' });
  }
});

module.exports = router;
