const express = require('express');
const Doctor = require('../models/Doctor');

// Update the Doctor schedule
const updateDoctorSchedules = async () => {
    try {
      const currentDateTime = new Date();
      // Fetch all doctors
      const doctors = await Doctor.find();
      for (const doctor of doctors) {
        // Filter out outdated time slots
        doctor.schedule = doctor.schedule.map((day) => {
          if (day.date < currentDateTime) return null; // Remove outdated days
          if (day.date.toDateString() === currentDateTime.toDateString()) {
            // Update today's slots
            day.timeSlots = day.timeSlots.map((slot) => {
              // Remove expired status assignment to avoid validation error
              // If you want to mark expired, use a valid status like 'Holiday' or 'Booked', or just skip
              return slot;
            });
          }
          return day;
        }).filter(Boolean);
        // Add new dates for the next 30 days
        const next30Days = Array.from({ length: 30 }, (_, i) => {
          const newDate = new Date();
          newDate.setDate(currentDateTime.getDate() + i + 1);
          return {
            date: newDate,
            timeSlots: generateTimeSlots(),
          };
        });
        doctor.schedule.push(...next30Days);
        // Save updated schedule
        await doctor.save();
      }
  
      console.log('Real-time schedules updated for all doctors!');
    } catch (error) {
      console.error('Error in real-time schedule update:', error);
    }
  };
  
  // Helper to generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9:00 AM
    const endHour = 18; // 6:00 PM
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour}:00 - ${hour + 1}:00`;
      slots.push({ time, status: 'Free' });
    }
    return slots;
  };
  
  module.exports = updateDoctorSchedules;