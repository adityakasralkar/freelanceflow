require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Initialize DB connection on startup
require('./config/db');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({ origin: process.env.CLIENT_URL }));

// Request logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FreelanceFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const clientsRoutes = require('./routes/clients.routes');
const proposalsRoutes = require('./routes/proposals.routes');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/proposals', proposalsRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', code: 404 });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
