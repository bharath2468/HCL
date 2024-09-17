// router.js

const express = require('express');
const router = express.Router();

const patientRoutes = require('../controllers/patient');
const doctorRoutes = require('../controllers/doctor');
const appointmentRoutes = require('../controllers/appointment');

// Use routes
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
