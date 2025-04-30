const { check } = require("express-validator");

// Contact page validation rules
const contactValidation = [
  check("firstName") // Ensure the field name matches the request body
    .notEmpty().withMessage("الاسم الأول مطلوب")
    .isLength({ min: 3, max: 50 }).withMessage("الاسم الأول يجب أن يكون بين 3 و 50 حرفًا")
    .matches(/^[\p{L}\s]+$/u).withMessage("الاسم الأول يجب أن يحتوي على أحرف ومسافات فقط")
    .trim()
    .escape(),

  check("last-name")
    .notEmpty().withMessage("الاسم الأخير مطلوب")
    .isLength({ min: 3, max: 50 }).withMessage("الاسم الأخير يجب أن يكون بين 3 و 50 حرفًا")
    .matches(/^[\p{L} ]+$/u).withMessage("الاسم الأخير يجب أن يحتوي على أحرف ومسافات فقط")
    .trim()
    .escape(),

  check("gender")
    .notEmpty().withMessage("الجنس مطلوب")
    .custom((value) => {
      const allowedGenders = ["male", "female"];
      return allowedGenders.includes(value);
    })
    .withMessage("الجنس يجب أن يكون ذكر أو أنثى")
    .trim()
    .escape(),

  check("phone")
    .notEmpty().withMessage("رقم الجوال مطلوب")
    .matches(/^[0-9]{10,15}$/).withMessage("رقم الجوال يجب أن يتكون من 10 إلى 15 رقمًا")
    .trim()
    .escape(),

  check("dob")
    .notEmpty().withMessage("تاريخ الميلاد مطلوب")
    .custom((value) => {
      const today = new Date();
      const dob = new Date(value);
      return dob < today;
    }).withMessage("تاريخ الميلاد يجب أن يكون في الماضي"),

  check("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("الرجاء إدخال بريد إلكتروني صحيح")
    .isLength({ min: 5, max: 80 }).withMessage("البريد الإلكتروني يجب أن يكون بين 5 و 80 حرفًا")
    .matches(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/).withMessage("البريد الإلكتروني يجب أن يكون بصيغة صحيحة")
    .normalizeEmail()
    .trim()
    .escape(),

  check("language")
    .notEmpty().withMessage("اللغة مطلوبة")
    .custom((value) => {
      const allowedLanguages = ["Arabic", "English", "Français"];
      return allowedLanguages.includes(value);
    })
    .withMessage("اللغة يجب أن تكون Arabic أو English أو Français")
    .trim()
    .escape(),

  check("message")
    .notEmpty().withMessage("الرسالة مطلوبة")
    .isLength({ min: 10, max: 1000 }).withMessage("الرسالة يجب أن تكون بين 10 و 1000 حرف")
    .trim()
    .escape(),
];

module.exports = contactValidation;