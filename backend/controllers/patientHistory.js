const express = require('express');
const router = express.Router();
const { redisClient } = require('../config/redis');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Get patient medical history from Redis (for RAG)
router.get('/history/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    // Try to get history from Redis
    const cached = await redisClient.get(`patient_history:${patientId}`);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    // If not in Redis, fetch from Patient.medicalHistory and cache it
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const history = patient.medicalHistory || [];
    await redisClient.set(`patient_history:${patientId}`, JSON.stringify(history));
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient history' });
  }
});

module.exports = router;
