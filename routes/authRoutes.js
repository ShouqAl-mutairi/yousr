const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');
const loginValidation = require('../validators/loginValidator');
const signupValidation = require('../validators/signupValidator');

// Login endpoint
router.post("/login", loginValidation, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { username, password } = req.body;
  
  // Check if user exists in database
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: "Username not found" });
      }
      
      const user = results[0];
      
      if (password !== user.password) {
        return res.status(401).json({ error: "Invalid password" });
      }
      
      // Determine avatar path based on gender
      let avatarPath = user.gender === 'female' 
        ? '../assets/images/avatar/freelancer-woman-one.png' 
        : '../assets/images/avatar/freelancer-man-one.png';
      
      // Success - return user data with avatar
      res.json({ 
        success: true, 
        message: "Login successful", 
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          user_role: user.user_role,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          avatar: avatarPath
        }
      });
    }
  );
});

// Sign-up endpoint
router.post("/signup", signupValidation, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ 
      success: false,
      message: "فشل في إنشاء الحساب",
      details: "الرجاء التحقق من المعلومات المدخلة",
      errors: errors.array() 
    });
  }
  
  console.log("Signup request body:", req.body);
  
  const { username, email, password, phone, gender, first_name, last_name } = req.body;
  
  const user_role = req.body["user-role"];
  
  let date_of_birth = req.body.date_of_birth;
  console.log("Original date_of_birth received:", date_of_birth);
  
  if (date_of_birth) {
    try {
      date_of_birth = date_of_birth.toString().trim();
      
      console.log("Formatted date_of_birth for database:", date_of_birth);
    } catch (error) {
      console.error("Error processing date:", error);
      return res.status(400).json({ 
        success: false,
        message: "خطأ في تاريخ الميلاد",
        details: "يجب أن يكون تاريخ الميلاد صالحًا",
        errors: [{ msg: "Date of birth must be a valid date" }] 
      });
    }
  }
  
  // First check if username already exists
  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Database error during username check:", error);
        return res.status(500).json({ 
          success: false,
          message: "خطأ في قاعدة البيانات",
          details: "حدث خطأ أثناء التحقق من اسم المستخدم",
          error: "Database error" 
        });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ 
          success: false,
          message: "اسم المستخدم غير متاح",
          details: "اسم المستخدم مستخدم بالفعل، الرجاء اختيار اسم مستخدم آخر",
          error: "اسم المستخدم مستخدم بالفعل" 
        });
      }
      
      // Then check if email already exists
      pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            console.error("Database error during email check:", error);
            return res.status(500).json({ 
              success: false,
              message: "خطأ في قاعدة البيانات",
              details: "حدث خطأ أثناء التحقق من البريد الإلكتروني",
              error: "Database error" 
            });
          }
          
          if (results.length > 0) {
            return res.status(409).json({ 
              success: false,
              message: "البريد الإلكتروني غير متاح",
              details: "البريد الإلكتروني مستخدم بالفعل",
              error: "البريد الإلكتروني مستخدم بالفعل" 
            });
          }
          
          // Insert new user
          const userData = { 
            username, 
            email, 
            password, 
            phone, 
            user_role,
            gender, 
            date_of_birth,
            first_name,
            last_name
          };
          
          console.log("Inserting user data:", userData);
          
          pool.query(
            "INSERT INTO users SET ?",
            userData,
            (error, result) => {
              if (error) {
                console.error("Database error during user creation:", error);
                return res.status(500).json({ 
                  success: false,
                  message: "فشل في إنشاء الحساب",
                  details: `حدث خطأ أثناء إنشاء الحساب: ${error.message}`,
                  error: `Failed to create user: ${error.message}` 
                });
              }
              
              res.status(201).json({ 
                success: true, 
                message: "تم إنشاء الحساب بنجاح",
                details: "يمكنك الآن تسجيل الدخول باستخدام بيانات حسابك",
                userId: result.insertId
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;