const { check } = require("express-validator");

// Login validation rules
const loginValidation = [
  check("username")
    .notEmpty().withMessage("اسم المستخدم مطلوب")
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا")
    .matches(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي على أحرف وأرقام فقط")
    .isString().withMessage("اسم المستخدم يجب أن يكون نصًا")
    .trim()
    .escape(),
  check("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8, max: 35 }).withMessage("كلمة المرور يجب أن تكون بين 8 و 35 حرفًا")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص")
    .isString().withMessage("كلمة المرور يجب أن تكون نصًا")
];

module.exports = loginValidation;