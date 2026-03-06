const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const setupSwagger = require('./src/config/swagger');
const v1Routes = require('./src/routes/v1');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
}));

setupSwagger(app);

app.use('/api/v1', v1Routes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'TaskFlow API is running!', docs: '/api-docs' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
