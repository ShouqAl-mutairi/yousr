const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { profileValidationRules, validateProfile } = require('../validators/profileValidator');

// Profile endpoint to get user data
router.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  
  pool.query(
    "SELECT id, username, first_name, last_name, email, phone, gender, date_of_birth, user_role, is_available, profile_bio, specialty, min_price, max_price FROM users WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في قاعدة البيانات",
          error: error.message 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "المستخدم غير موجود" 
        });
      }
      
      // Determine avatar path based on gender
      const user = results[0];
      let avatarPath = user.gender === 'female' 
        ? '../assets/images/avatar/freelancer-woman-one.png' 
        : '../assets/images/avatar/freelancer-man-one.png';
      
      res.json({
        success: true,
        user: {
          ...user,
          avatar: avatarPath
        }
      });
    }
  );
});

// Update profile information
router.put("/user/:id", profileValidationRules, validateProfile, (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, phone, date_of_birth, profile_bio, is_available, specialty, min_price, max_price } = req.body;
  
  // Log the received data for debugging
  console.log("Update profile request body:", req.body);
  console.log("Extracted specialty:", specialty);
  console.log("Extracted price range:", { min_price, max_price });
  
  pool.query(
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, profile_bio = ?, is_available = ?, specialty = ?, min_price = ?, max_price = ? WHERE id = ?",
    [first_name, last_name, email, phone, date_of_birth, profile_bio, is_available ? 1 : 0, specialty, min_price, max_price, userId],
    (error, result) => {
      if (error) {
        console.error("Database error during profile update:", error);
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في تحديث البيانات",
          error: error.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "المستخدم غير موجود" 
        });
      }
      
      res.json({
        success: true,
        message: "تم تحديث البيانات بنجاح",
        user: {
          id: userId,
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          profile_bio,
          is_available: is_available ? 1 : 0,
          specialty,
          min_price,
          max_price
        }
      });
    }
  );
});

// Delete account endpoint
router.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  
  pool.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في حذف الحساب",
          error: error.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "المستخدم غير موجود" 
        });
      }
      
      res.json({
        success: true,
        message: "تم حذف الحساب بنجاح"
      });
    }
  );
});

// Get available freelancers for the freelancers page
router.get("/freelancers", (req, res) => {
  pool.query(
    "SELECT id, username, first_name, last_name, email, phone, gender, user_role, profile_bio, specialty, min_price, max_price FROM users WHERE user_role = 'freelancer' AND is_available = 1",
    (error, results) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في قاعدة البيانات",
          error: error.message 
        });
      }
      
      // Add avatar paths to each freelancer
      const freelancers = results.map(freelancer => {
        const avatarPath = freelancer.gender === 'female' 
          ? '../assets/images/avatar/freelancer-woman-one.png' 
          : '../assets/images/avatar/freelancer-man-one.png';
          
        return {
          ...freelancer,
          avatar: avatarPath
        };
      });
      
      res.json({
        success: true,
        freelancers
      });
    }
  );
});

module.exports = router;