const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MERN + ML backend running' });
});

// ML test route (placeholder)
app.post('/api/process', (req, res) => {
  res.json({ message: 'ML endpoint ready', data: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});