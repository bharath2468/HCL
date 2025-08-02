const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const updateDoctorSchedules = require('./config/schedule');
const authRoutes = require('./routes/authRoutes');
const modelRoutes = require('./routes/modelRoutes')
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins by default
app.use(express.json()); // Parse JSON request bodies

// Connect to database
connectDB();
// Connect to Redis
connectRedis();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', modelRoutes);

// Update Doctor Schedule
updateDoctorSchedules();

// Define a test route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital Record Management System');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
