const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { swaggerUi, specs } = require('./swagger');
require('express-async-errors'); // To handle async errors

const consultationRoutes = require('./routes/consultationRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const serviceLocatorRoutes = require('./routes/serviceLocatorRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/consultation', consultationRoutes);
app.use('/api/alerts', emergencyRoutes);
app.use('/api/locator', serviceLocatorRoutes);
app.use('/api/auth', authRoutes);

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
