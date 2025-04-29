// Profile validation middleware
const { check, validationResult } = require('express-validator');

// Profile validation rules
const profileValidationRules = [
    // Personal Information Validation
    check('firstName')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('الاسم الأول يجب أن يكون بين 2-30 حرف')
        .matches(/^[a-zA-Zأ-ي\s]*$/)
        .withMessage('الاسم الأول يجب أن يحتوي على أحرف فقط'),
        
    check('lastName')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('الاسم الأخير يجب أن يكون بين 2-30 حرف')
        .matches(/^[a-zA-Zأ-ي\s]*$/)
        .withMessage('الاسم الأخير يجب أن يحتوي على أحرف فقط'),
        
    check('email')
        .trim()
        .isEmail()
        .withMessage('يرجى إدخال بريد إلكتروني صحيح')
        .normalizeEmail(),
        
    check('phone')
        .trim()
        .matches(/^[0-9]{10,15}$/)
        .withMessage('رقم الهاتف يجب أن يتكون من 10-15 رقم فقط'),
        
    check('dob')
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage('تاريخ الميلاد يجب أن يكون بتنسيق صحيح')
        .custom(value => {
            const dob = new Date(value);
            const today = new Date();
            if (dob >= today) {
                throw new Error('تاريخ الميلاد يجب أن يكون في الماضي');
            }
            return true;
        }),
    
    // Freelancer-specific fields (optional)
    check('specialty')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('التخصص يجب أن يكون بين 2-50 حرف')
        .matches(/^[a-zA-Zأ-ي0-9\s\-,.]*$/)
        .withMessage('التخصص يحتوي على أحرف أو أرقام غير مسموح بها'),
        
    check('bio')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('النبذة المهنية يجب أن تكون بين 10-500 حرف'),
        
    check('minPrice')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('الحد الأدنى للسعر يجب أن يكون رقماً')
        .custom((value, { req }) => {
            const minPrice = parseFloat(value);
            if (minPrice < 0) {
                throw new Error('الحد الأدنى للسعر يجب أن يكون رقماً موجباً');
            }
            return true;
        }),
        
    check('maxPrice')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('الحد الأقصى للسعر يجب أن يكون رقماً')
        .custom((value, { req }) => {
            const maxPrice = parseFloat(value);
            const minPrice = parseFloat(req.body.minPrice || 0);
            
            if (maxPrice < 0) {
                throw new Error('الحد الأقصى للسعر يجب أن يكون رقماً موجباً');
            }
            
            if (minPrice && maxPrice && minPrice >= maxPrice) {
                throw new Error('الحد الأقصى للسعر يجب أن يكون أكبر من الحد الأدنى');
            }
            
            return true;
        })
];

// Middleware to validate profile data
const validateProfile = (req, res, next) => {
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
    profileValidationRules,
    validateProfile
};