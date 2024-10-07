const mongoose = require('mongoose');

// Define time slot schema
const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Booked', 'Free', 'Holiday'],
    default: 'Free'  // Default status is 'Free'
  }
});

// Define daily schedule schema
const dailyScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [timeSlotSchema]  // Array of time slots for the day
});

// Doctor schema with schedule
const doctorSchema = new mongoose.Schema({
  hospitalEmail: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  schedule: [dailyScheduleSchema],  // Schedule for upcoming 30 days
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate schedule for the next 30 days
doctorSchema.pre('save', function(next) {
  const doctor = this;

  // Generate 30 days schedule starting from today
  const generateSchedule = () => {
    const schedule = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      // Create date for the day
      const date = new Date(now);
      date.setDate(now.getDate() + i);

      // Generate time slots from 9:00 AM to 6:00 PM (1-hour slots)
      const timeSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        const timeString = `${hour}:00`;
        timeSlots.push({
          time: timeString,
          status: 'Free'  // Default status is 'Free'
        });
      }

      // Add the day's schedule
      schedule.push({
        date: date,
        timeSlots: timeSlots
      });
    }

    return schedule;
  };

  // If schedule is empty, populate it
  if (doctor.schedule.length === 0) {
    doctor.schedule = generateSchedule();
  }

  next();
});

//methos to get the schedules of doctor
doctorSchema.methods.getDoctorDetailsWithUpcomingSchedule = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set time to midnight for date comparison

  // Filter the schedule for dates from today onwards
  const upcomingSchedule = this.schedule.filter(schedule => {
    return schedule.date >= today;
  });

  // Return the entire doctor object, including the filtered schedule
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    specialization: this.specialization,
    contactNumber: this.contactNumber,
    email: this.email,
    schedule: upcomingSchedule,  // Only the upcoming schedule
    createdAt: this.createdAt
  };
};

// Define a method to get availability
doctorSchema.methods.getAvailableSlots = function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    specialization: this.specialization,
    contactNumber: this.contactNumber,
    email: this.email,
    schedule: this.schedule.map(day => ({
      date: day.date,
      timeSlots: day.timeSlots.filter(slot => slot.status === 'Free')
    }))
  };
};

// Create the Doctor model from the schema
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
