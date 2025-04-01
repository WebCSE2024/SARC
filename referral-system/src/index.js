const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rabbitMQ = require('./config/rabbitmq');
require('dotenv').config();

// Import routes
const referralRoutes = require('./routes/referralRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Connect to RabbitMQ
rabbitMQ.connect()
  .then(() => console.log('RabbitMQ setup completed'))
  .catch(err => console.error('RabbitMQ setup error:', err));

// Routes
app.use('/api/referrals', authMiddleware, referralRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await rabbitMQ.closeConnection();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});