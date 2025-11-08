const express = require('express');
const dotenv = require('dotenv');
// const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

// Swagger documentation route
dotenv.config();

const app = express();
app.use(express.json());

// connectDB();

const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Pet Health & Care Management API' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.NODE_PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})