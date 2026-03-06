const logger = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
    logger.error(err.message, { stack: err.stack, path: req.path });

    if (err.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'A record with this value already exists.' });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Record not found.' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token has expired.' });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error.' });
};

const notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
