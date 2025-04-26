// Yousr - Backend Server
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
  port: 3306, // Default MAMP MySQL port
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

// Form validation rules
// Login validation
const loginValidation = [
  body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

// Sign-up validation
const signupValidation = [
  body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").isLength({ min: 10 }).withMessage("Phone number must be at least 10 digits"),
  body("user-role").isIn(["freelancer", "client"]).withMessage("User role must be freelancer or client"),
  body("gender").isIn(["male", "female"]).withMessage("Gender must be male or female"),
  // Simplified date validation
  body("date_of_birth").notEmpty().withMessage("Date of birth is required")
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
      
      // In a real app, you'd use bcrypt to compare hashed passwords
      if (password !== user.password) {
        return res.status(401).json({ error: "Invalid password" });
      }
      
      // Success - in a real app, you would create a session/JWT here
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
  
  // Log the request body to see what we're receiving
  console.log("Signup request body:", req.body);
  
  const { username, email, password, phone, gender } = req.body;
  
  // Get user_role from user-role (handling the different field name)
  const user_role = req.body["user-role"];
  
  // Handle date_of_birth - ensure it's in the correct format
  let date_of_birth = req.body.date_of_birth;
  console.log("Original date_of_birth received:", date_of_birth);
  
  // Direct approach without complex parsing to avoid potential errors
  if (date_of_birth) {
    try {
      // For MySQL date fields, YYYY-MM-DD format is required
      // HTML date inputs typically return this format already
      // Just ensure it's a string and remove any whitespace
      date_of_birth = date_of_birth.toString().trim();
      
      console.log("Formatted date_of_birth for database:", date_of_birth);
    } catch (error) {
      console.error("Error processing date:", error);
      return res.status(400).json({ 
        errors: [{ msg: "Date of birth must be a valid date" }] 
      });
    }
  }
  
  // Check if email already exists
  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error("Database error during email check:", error);
        return res.status(500).json({ error: "Database error" });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
      
      // Insert new user
      const userData = { 
        username, 
        email, 
        password, 
        phone, 
        user_role, // Now contains the value from user-role field
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
});

// Get all users (admin feature)
app.get("/users", (req, res) => {
  pool.query("SELECT id, username, email, phone, user_role, gender, date_of_birth FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Activating server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});