// doctorRoutes.js

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Import your Doctor model
const nodemailer = require('nodemailer');

// Create a new doctor
router.post('/create', async (req, res) => {
  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let password = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };
  try {
    const password = generatePassword();
    req.body.password = password;
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    //Send Welcome mail
    const newDoctormail = newDoctor.email;
    const newDoctorname = newDoctor.firstName;
    const newDoctorpass = newDoctor.password;
    const newDoctorspec = newDoctor.specialization;

    async function sendEmail(newDoctormail, newDoctorname, newDoctorpass, newDoctorspec) {
      // Create a transporter
      const transporter = nodemailer.createTransport({
          service: 'Gmail', // or another service
          auth: {
              user: 'bh3214321@gmail.com', // Your email
              pass: "cisy ailr uooy hlkd" // Your email password or app-specific password
          }
      });
  
      // Set email options
      const mailOptions = {
          from: 'bh3214321@gmail.com',
          to: `${newDoctormail}`,
          subject: 'Welcome to the Hospital!',
          text: `Dear Dr. ${newDoctorname},

          We are delighted to welcome you to the Hospital family! Your expertise as a ${newDoctorspec} will be a valuable asset to our team and the patients we serve.
          
          At our Hospital, we are committed to providing the highest level of care, and we believe that your dedication and skills will contribute significantly to our shared mission. We look forward to collaborating with you to continue delivering exceptional healthcare.
          
          Here are your account details for accessing our hospital management system:
          
          Email: ${newDoctormail}
          Password: ${newDoctorpass}`
      };
    
      try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
      } catch (error) {
          console.error('Error sending email:', error);
      }
    }
    sendEmail(newDoctormail, newDoctorname, newDoctorpass, newDoctorspec);
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
    const doc = await Doctor.findById(req.params.id);
    const doctor = doc.getDoctorDetailsWithUpcomingSchedule();
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
