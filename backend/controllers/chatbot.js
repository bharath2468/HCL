
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const mongoose = require('mongoose');
const { redisClient } = require('../config/redis');


// POST /api/chatbot/generate
router.post('/generate', async (req, res) => {
  try {
    const { query, patientId } = req.body;
    console.log('Received query:', query, 'for patientId:', patientId);
    let patientHistoryText = '';
    if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
      // Try to get patient history from Redis
      let appointments = [];
      const redisKey = `patient_history:${patientId}`;
      const cached = await redisClient.get(redisKey);
      if (cached) {
        appointments = JSON.parse(cached);
      } else {
        // Only store date and medicalCondition for each appointment
        const appts = await Appointment.find({ patientId }).sort({ date: -1 });
        appointments = appts.map(appt => ({
          date: appt.date,
          medicalCondition: appt.medicalCondition || 'N/A'
        }));
        await redisClient.set(redisKey, JSON.stringify(appointments));
      }
      if (appointments.length > 0) {
        patientHistoryText += 'Appointments and Medical Conditions:\n';
        appointments.forEach((appt, idx) => {
          patientHistoryText += `- Date: ${new Date(appt.date).toISOString().split('T')[0]}, Condition: ${appt.medicalCondition}\n`;
        });
      }
    }
    // Compose prompt for LLM
    const prompt = `Act like you're an ai assistant for doctor and based on the give patient appointment details which includes the date and medical condition noted by the doctor, you are supposed to give answer the user query in a professional way like an assistant.\nHere is the patient history:\n${patientHistoryText}\nUser Query: ${query}`;
    const API_KEY = process.env.GEMINI_API;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    };
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error generating content' });
  }
});

module.exports = router;