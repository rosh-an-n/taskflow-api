const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API v1 is running.',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
