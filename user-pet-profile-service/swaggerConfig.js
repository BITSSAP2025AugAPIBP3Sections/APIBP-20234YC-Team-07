const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Pet Health & Care Management API',
        version: '1.0.0',
        description: 'API documentation for Pet Health & Care Management System',
    },
    servers: [
        {
            url: 'http://localhost:3009',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', // Optional, indicates that this uses JWT
            },
        },
    },
    security: [
        {
            bearerAuth: [], // Apply this globally to all endpoints requiring auth
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/adminRoutes.js','./routes/userRoutes.js','./routes/petRoutes.js','./routes/preferencesRoutes.js','./routes/healthRecordRoutes.js'], // Path to the API docs
};

module.exports = swaggerJSDoc(options);
