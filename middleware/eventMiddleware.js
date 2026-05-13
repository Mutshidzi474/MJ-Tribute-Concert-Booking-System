const {body, validationResult} = require('express-validator');

// Middleware to validate event data
exports.validateEvent = [
    body('name').notEmpty().withMessage('Event name is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Event location is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        // If there are validation errors, return a 400 response with the error details
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }       
];

// Export the middleware functions
module.exports = {
    validateEvent
};
