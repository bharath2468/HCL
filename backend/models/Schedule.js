const cron = require('node-cron');
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');  // Assuming doctor model is in models/doctor.js

// Function to update schedule for all doctors
const updateAllDoctorsSchedule = async () => {
  try {
    // Find all doctors in the database
    const doctors = await Doctor.find();
    
    // Loop through all doctors and update their schedule
    for (const doctor of doctors) {
      await updateDoctorSchedule(doctor._id);
    }

    console.log('Schedules updated for all doctors.');
  } catch (error) {
    console.error('Error updating doctors schedule:', error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily doctor schedule update...');
  updateAllDoctorsSchedule();
});

// Function to update a single doctor's schedule (same as before)
const updateDoctorSchedule = async (doctorId) => {
  try {
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      console.error('Doctor not found');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset time to midnight for comparison

    const lastScheduledDay = doctor.schedule.length 
      ? new Date(doctor.schedule[doctor.schedule.length - 1].date)
      : null;

    if (lastScheduledDay) {
      lastScheduledDay.setHours(0, 0, 0, 0);
    }

    const daysToAdd = Math.max(0, 30 - (Math.floor((lastScheduledDay - today) / (1000 * 60 * 60 * 24)) + 1));

    for (let i = 0; i < daysToAdd; i++) {
      const newDay = new Date();
      newDay.setDate(today.getDate() + (lastScheduledDay ? i + 1 : i));

      const timeSlots = [];
      for (let hour = 9; hour <= 18; hour++) {
        timeSlots.push({ time: `${hour}:00`, status: 'Free' });
      }

      doctor.schedule.push({ date: newDay, timeSlots });
    }

    await doctor.save();
  } catch (error) {
    console.error('Error updating doctor schedule:', error);
  }
};
