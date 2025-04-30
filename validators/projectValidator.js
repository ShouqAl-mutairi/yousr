// Project validation middleware
const { check, validationResult } = require('express-validator');

// Project validation rules
const projectValidationRules = [
    // Project Information Validation
    check('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('عنوان المشروع يجب أن يكون بين 5-100 حرف')
        .matches(/^[\u0600-\u06FFa-zA-Z0-9\s.,!?-]*$/)
        .withMessage('عنوان المشروع يحتوي على أحرف غير مسموح بها'),
        
    check('category')
        .notEmpty()
        .withMessage('يجب اختيار فئة المشروع'),
        
    check('description')
        .trim()
        .isLength({ min: 20, max: 1000 })
        .withMessage('وصف المشروع يجب أن يكون بين 20-1000 حرف')
        .matches(/^[\u0600-\u06FFa-zA-Z0-9\s.,!?()-]*$/)
        .withMessage('وصف المشروع يحتوي على أحرف غير مسموح بها'),
        
    check('user_id')
        .notEmpty()
        .withMessage('معرف المستخدم مطلوب')
        .isNumeric()
        .withMessage('معرف المستخدم يجب أن يكون رقماً'),
];

// Middleware to validate project data
const validateProject = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }
    next();
};

module.exports = {
    projectValidationRules,
    validateProject
};