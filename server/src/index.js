require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Initialize DB connection on startup
require('./config/db');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers (CSP relaxed for Swagger UI)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS — allow frontend origin
app.use(cors({ origin: process.env.CLIENT_URL }));

// Request logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());

// Swagger UI — public, no auth required
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'FreelanceFlow API Docs' }));

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
const projectsRoutes = require('./routes/projects.routes');
const milestonesRouter = require('./routes/milestones.routes');
const invoicesRoutes = require('./routes/invoices.routes');
const clientPortalRoutes = require('./routes/clientPortal.routes');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/projects/:projectId/milestones', milestonesRouter);
app.use('/api/milestones', milestonesRouter);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/client-portal', clientPortalRoutes);

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
