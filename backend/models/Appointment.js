const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',  // Refers to the Doctor model (assuming a separate model for doctors)
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',  // Refers to the Patient model (assuming a separate model for patients)
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
