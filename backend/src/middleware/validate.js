const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
        });
    }
    next();
};

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required.').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.').escape(),
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    handleValidationErrors,
];

const validateLogin = [
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
    handleValidationErrors,
];

const validateCreateTask = [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ min: 1, max: 255 }).escape(),
    body('description').optional().trim().isLength({ max: 1000 }).escape(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status.'),
    handleValidationErrors,
];

const validateUpdateTask = [
    param('id').isUUID().withMessage('Invalid task ID.'),
    body('title').optional().trim().isLength({ min: 1, max: 255 }).escape(),
    body('description').optional().trim().isLength({ max: 1000 }).escape(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status.'),
    handleValidationErrors,
];

const validateTaskId = [
    param('id').isUUID().withMessage('Invalid task ID.'),
    handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateCreateTask, validateUpdateTask, validateTaskId };
