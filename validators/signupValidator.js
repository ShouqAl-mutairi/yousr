const { check } = require("express-validator");

// Sign-up validation rules
const signupValidation = [
  check("username")
    .notEmpty().withMessage("اسم المستخدم مطلوب")
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا")
    .matches(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي على أحرف وأرقام فقط")
    .isString().withMessage("اسم المستخدم يجب أن يكون نصًا")
    .trim()
    .escape(),
  check("first_name")
    .notEmpty().withMessage("الاسم الأول مطلوب")
    .isLength({ min: 2, max: 30 }).withMessage("الاسم الأول يجب أن يكون بين 2 و 30 حرفًا")
    .matches(/^[a-zA-Zأ-ي\s]{2,30}$/).withMessage("الاسم الأول يجب أن يتكون من أحرف فقط")
    .isString().withMessage("الاسم الأول يجب أن يكون نصًا")
    .trim()
    .escape(),
  check("last_name")
    .notEmpty().withMessage("الاسم الأخير مطلوب")
    .isLength({ min: 2, max: 30 }).withMessage("الاسم الأخير يجب أن يكون بين 2 و 30 حرفًا")
    .matches(/^[a-zA-Zأ-ي\s]{2,30}$/).withMessage("الاسم الأخير يجب أن يتكون من أحرف فقط")
    .isString().withMessage("الاسم الأخير يجب أن يكون نصًا")
    .trim()
    .escape(),
  check("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("الرجاء إدخال بريد إلكتروني صحيح")
    .isLength({ min: 5, max: 80 }).withMessage("البريد الإلكتروني يجب أن يكون بين 5 و 80 حرفًا")
    .matches(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/).withMessage("البريد الإلكتروني يجب أن يكون بصيغة صحيحة")
    .normalizeEmail()
    .trim()
    .escape(),
  check("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8, max: 35 }).withMessage("كلمة المرور يجب أن تكون بين 8 و 35 حرفًا")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص")
    .isString().withMessage("كلمة المرور يجب أن تكون نصًا"),
  check("phone")
    .notEmpty().withMessage("رقم الهاتف مطلوب")
    .isLength({ min: 10, max: 15 }).withMessage("رقم الهاتف يجب أن يكون بين 10 و 15 رقمًا")
    .matches(/[0-9]{10,}/).withMessage("رقم الهاتف يجب أن يتكون من أرقام فقط")
    .trim(),
  check("user-role")
    .notEmpty().withMessage("نوع المستخدم مطلوب")
    .custom((value) => {
      const whitelist = ["freelancer", "client"];
      if (whitelist.includes(value)) return true;
      return false;
    })
    .withMessage("نوع المستخدم يجب أن يكون فريلانسر أو عميل")
    .trim()
    .escape(),
  check("gender")
    .notEmpty().withMessage("الجنس مطلوب")
    .custom((value) => {
      const whitelist = ["male", "female"];
      if (whitelist.includes(value)) return true;
      return false;
    })
    .withMessage("الجنس يجب أن يكون ذكر أو أنثى")
    .trim()
    .escape(),
  check("date_of_birth")
    .notEmpty().withMessage("تاريخ الميلاد مطلوب")
    .isDate().withMessage("تاريخ الميلاد يجب أن يكون بصيغة صحيحة")
    .trim()
];

module.exports = signupValidation;