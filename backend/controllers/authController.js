const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, address, contact, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      address,
      contact,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        address:user.address,
        contact:user.contact,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role === 'admin'){
      const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      name: user.name,
      address:user.address,
      contact:user.contact,
      email: user.email,
      token: generateToken(user._id)
    });
    }
    else {
      const doctor = await Doctor.findOne({ email });
      hospitalemail = doctor.hospitalEmail;
      const user = await User.findOne({ email:hospitalemail });
      if (doctor.password===password){
        // Send response with user data and token
        console.log(6)
      res.json({user:{name: user.name,
        address:user.address,
        contact:user.contact,
        email: user.email,
        token: generateToken(user._id)},
        doctor:{firstname: doctor.firstName,
          lastname: doctor.lastName,
          contact: doctor.contactNumber,
          email: doctor.email,
          token: generateToken(doctor._id)}
    });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
};
