const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const app = express();
const port = 3000;

// Setting up database connection
const mysql = require("mysql2");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "yousr",
  port: 3306,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static website
app.use(express.static(path.join(__dirname, "Website")));

// Routes for HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "contact.html"));
});

app.get("/freelancers", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "freelancers.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "Website", "html", "sign-up.html"));
});


// Login validation
const loginValidation = [
  body("username")
    .notEmpty().withMessage("اسم المستخدم مطلوب")
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا")
    .matches(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي على أحرف وأرقام فقط")
    .isString().withMessage("اسم المستخدم يجب أن يكون نصًا")
    .trim()
    .escape(),
  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8, max: 35 }).withMessage("كلمة المرور يجب أن تكون بين 8 و 35 حرفًا")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص")
    .isString().withMessage("كلمة المرور يجب أن تكون نصًا")
];

// Sign-up validation
const signupValidation = [
  body("username")
    .notEmpty().withMessage("اسم المستخدم مطلوب")
    .isLength({ min: 3, max: 20 }).withMessage("اسم المستخدم يجب أن يكون بين 3 و 20 حرفًا")
    .matches(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/).withMessage("اسم المستخدم يجب أن يبدأ بحرف ويحتوي على أحرف وأرقام فقط")
    .isString().withMessage("اسم المستخدم يجب أن يكون نصًا")
    .trim()
    .escape(),
  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("الرجاء إدخال بريد إلكتروني صحيح")
    .isLength({ min: 5, max: 80 }).withMessage("البريد الإلكتروني يجب أن يكون بين 5 و 80 حرفًا")
    .matches(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/).withMessage("البريد الإلكتروني يجب أن يكون بصيغة صحيحة")
    .normalizeEmail()
    .trim()
    .escape(),
  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8, max: 35 }).withMessage("كلمة المرور يجب أن تكون بين 8 و 35 حرفًا")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,35}/).withMessage("كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص")
    .isString().withMessage("كلمة المرور يجب أن تكون نصًا"),
  body("phone")
    .notEmpty().withMessage("رقم الهاتف مطلوب")
    .isLength({ min: 10, max: 15 }).withMessage("رقم الهاتف يجب أن يكون بين 10 و 15 رقمًا")
    .matches(/[0-9]{10,}/).withMessage("رقم الهاتف يجب أن يتكون من أرقام فقط")
    .trim(),
  body("user-role")
    .notEmpty().withMessage("نوع المستخدم مطلوب")
    .custom((value) => {
      const whitelist = ["freelancer", "client"];
      if (whitelist.includes(value)) return true;
      return false;
    })
    .withMessage("نوع المستخدم يجب أن يكون فريلانسر أو عميل")
    .trim()
    .escape(),
  body("gender")
    .notEmpty().withMessage("الجنس مطلوب")
    .custom((value) => {
      const whitelist = ["male", "female"];
      if (whitelist.includes(value)) return true;
      return false;
    })
    .withMessage("الجنس يجب أن يكون ذكر أو أنثى")
    .trim()
    .escape(),
  body("date_of_birth")
    .notEmpty().withMessage("تاريخ الميلاد مطلوب")
    .isDate().withMessage("تاريخ الميلاد يجب أن يكون بصيغة صحيحة")
    .trim()
];

// Login endpoint
app.post("/login", loginValidation, (req, res) => {
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
      
      // Success
      res.json({ success: true, message: "Login successful", user: { id: user.id, username: user.username } });
    }
  );
});

// Sign-up endpoint
app.post("/signup", signupValidation, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log("Signup request body:", req.body);
  
  const { username, email, password, phone, gender } = req.body;
  
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
        return res.status(500).json({ error: "Database error" });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: "اسم المستخدم مستخدم بالفعل، الرجاء اختيار اسم مستخدم آخر" });
      }
      
      // Then check if email already exists
      pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            console.error("Database error during email check:", error);
            return res.status(500).json({ error: "Database error" });
          }
          
          if (results.length > 0) {
            return res.status(409).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
          }
          
          // Insert new user
          const userData = { 
            username, 
            email, 
            password, 
            phone, 
            user_role,
            gender, 
            date_of_birth 
          };
          
          console.log("Inserting user data:", userData);
          
          pool.query(
            "INSERT INTO users SET ?",
            userData,
            (error, result) => {
              if (error) {
                console.error("Database error during user creation:", error);
                return res.status(500).json({ error: `Failed to create user: ${error.message}` });
              }
              
              res.status(201).json({ 
                success: true, 
                message: "User created successfully",
                userId: result.insertId
              });
            }
          );
        }
      );
    }
  );
});

// Activating server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});