const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { projectValidationRules, validateProject } = require('../validators/projectValidator');

// Get user projects
router.get("/user/:id/projects", (req, res) => {
  const userId = req.params.id;
  
  pool.query(
    "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في قاعدة البيانات",
          error: error.message 
        });
      }
      
      res.json({
        success: true,
        projects: results
      });
    }
  );
});

// Add new project
router.post("/projects", projectValidationRules, validateProject, (req, res) => {
  const { user_id, title, description, category, price } = req.body;
  
  pool.query(
    "INSERT INTO projects (user_id, title, description, category, price) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, description, category, price],
    (error, result) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في إضافة المشروع",
          error: error.message 
        });
      }
      
      res.status(201).json({
        success: true,
        message: "تم إضافة المشروع بنجاح",
        project_id: result.insertId
      });
    }
  );
});

// Update project
router.put("/projects/:id", projectValidationRules, validateProject, (req, res) => {
  const projectId = req.params.id;
  const { title, description, category, price } = req.body;
  
  pool.query(
    "UPDATE projects SET title = ?, description = ?, category = ?, price = ? WHERE id = ?",
    [title, description, category, price, projectId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في تحديث المشروع",
          error: error.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "المشروع غير موجود" 
        });
      }
      
      res.json({
        success: true,
        message: "تم تحديث المشروع بنجاح"
      });
    }
  );
});

// Delete project
router.delete("/projects/:id", (req, res) => {
  const projectId = req.params.id;
  
  pool.query(
    "DELETE FROM projects WHERE id = ?",
    [projectId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في حذف المشروع",
          error: error.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "المشروع غير موجود" 
        });
      }
      
      res.json({
        success: true,
        message: "تم حذف المشروع بنجاح"
      });
    }
  );
});

module.exports = router;