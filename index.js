require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import User Model
const User = require('./models/User');

// Initialize Express app
const app = express();
app.use(express.json());

// Load environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit on connection failure
  });

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Server is running');
  });

// Create a new user
app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active users
app.get('/users/active', async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true });
    res.status(200).json(activeUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
