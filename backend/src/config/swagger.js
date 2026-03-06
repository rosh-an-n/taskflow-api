const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./env');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'TaskFlow API',
        version: '1.0.0',
        description: 'A scalable REST API with JWT authentication, role-based access control, and full CRUD operations for task management.',
    },
    servers: [
        { url: `http://localhost:${config.port}`, description: 'Development server' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['user', 'admin'] },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            Task: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                    userId: { type: 'string', format: 'uuid' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', minLength: 2, example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', minLength: 6, example: 'password123' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                        type: 'object',
                        properties: {
                            user: { $ref: '#/components/schemas/User' },
                            token: { type: 'string' },
                        },
                    },
                },
            },
            CreateTaskRequest: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', minLength: 1, example: 'Complete project' },
                    description: { type: 'string', example: 'Finish the TaskFlow API project' },
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
                },
            },
            UpdateTaskRequest: {
                type: 'object',
                properties: {
                    title: { type: 'string', minLength: 1 },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                    errors: { type: 'array', items: { type: 'object' } },
                },
            },
        },
    },
};

const swaggerSpec = swaggerJsdoc({
    swaggerDefinition,
    apis: ['./src/routes/v1/*.js'],
});

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'TaskFlow API Docs',
    }));
};

module.exports = setupSwagger;
