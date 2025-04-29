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
        
    check('price')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('السعر يجب أن يكون رقماً')
        .custom(value => {
            const price = parseFloat(value);
            if (price < 0) {
                throw new Error('السعر يجب أن يكون رقماً موجباً');
            }
            return true;
        }),
        
    // Optional deadline validation if included
    check('deadline')
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage('تاريخ التسليم يجب أن يكون بتنسيق صحيح')
        .custom(value => {
            const deadline = new Date(value);
            const today = new Date();
            if (deadline <= today) {
                throw new Error('تاريخ التسليم يجب أن يكون في المستقبل');
            }
            return true;
        }),
        
    // Skills required for project - optional
    check('skills')
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage('المهارات المطلوبة يجب أن تكون قائمة')
        .custom(value => {
            if (value && Array.isArray(value)) {
                for (const skill of value) {
                    if (typeof skill !== 'string' || skill.length < 2 || skill.length > 30) {
                        throw new Error('المهارة يجب أن تكون بين 2-30 حرف');
                    }
                }
            }
            return true;
        })
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