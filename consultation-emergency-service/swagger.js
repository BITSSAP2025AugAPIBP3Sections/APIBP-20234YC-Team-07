const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Consultation & Emergency Services API',
            version: '1.0.0',
            description: 'API documentation for Consultation & Emergency Services',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
        components: {
            schemas: {
                Service: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The auto-generated id of the service'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the service'
                        },
                        type: {
                            type: 'string',
                            description: 'Type of the service'
                        },
                        location: {
                            type: 'string',
                            description: 'Location of the service'
                        },
                        contact: {
                            type: 'string',
                            description: 'Contact information of the service'
                        }
                    },
                    required: ['name', 'type', 'location', 'contact']
                },
                ServiceRecommendation: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Name of the recommended service'
                        },
                        type: {
                            type: 'string',
                            description: 'Type of the recommended service'
                        },
                        location: {
                            type: 'string',
                            description: 'Location of the recommended service'
                        },
                        contact: {
                            type: 'string',
                            description: 'Contact information of the recommended service'
                        }
                    },
                    required: ['name', 'type', 'location', 'contact']
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};