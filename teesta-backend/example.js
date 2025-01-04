const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Admin login controller
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // Admin authenticated, respond with success
    res.json({ success: true, message: 'Login successful' });
  } else {
    // Authentication failed
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin, getUsers };

