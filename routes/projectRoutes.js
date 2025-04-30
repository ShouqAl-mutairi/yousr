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
  const { user_id, title, description, category } = req.body;
  
  console.log("Received project data:", req.body);
  
  // First check if user exists
  pool.query(
    "SELECT id FROM users WHERE id = ?",
    [user_id],
    (userError, userResults) => {
      if (userError) {
        console.error("Error checking user:", userError);
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في التحقق من المستخدم",
          error: userError.message 
        });
      }
      
      if (userResults.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "المستخدم غير موجود" 
        });
      }

      // First, check the structure of the projects table
      pool.query("SHOW COLUMNS FROM projects", (columnsError, columns) => {
        if (columnsError) {
          console.error("Error getting table structure:", columnsError);
          return res.status(500).json({
            success: false,
            message: "خطأ في قاعدة البيانات",
            error: columnsError.message
          });
        }

        console.log("Projects table structure:", columns);
        
        // Check if there's an image column and if it's required
        const imageColumn = columns.find(col => col.Field === 'image');
        const createdAtColumn = columns.find(col => col.Field === 'created_at');
        
        // Build dynamic query based on table structure - WITHOUT price field
        let fields = ['user_id', 'title', 'description', 'category'];
        let placeholders = ['?', '?', '?', '?'];
        let values = [user_id, title, description, category];
        
        if (imageColumn && imageColumn.Null === 'NO') {
          fields.push('image');
          placeholders.push("''");
        }
        
        if (createdAtColumn && createdAtColumn.Default === null) {
          fields.push('created_at');
          placeholders.push('NOW()');
        }
        
        const query = `INSERT INTO projects (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
        console.log("Final query:", query);
        
        pool.query(query, values, (error, result) => {
          if (error) {
            console.error("Insert error:", error);
            return res.status(500).json({ 
              success: false, 
              message: "خطأ في إضافة المشروع",
              error: error.message 
            });
          } else {
            console.log("Project added successfully with ID:", result.insertId);
            res.status(201).json({
              success: true,
              message: "تم إضافة المشروع بنجاح",
              project_id: result.insertId
            });
          }
        });
      });
    }
  );
});

// Update project
router.put("/projects/:id", projectValidationRules, validateProject, (req, res) => {
  const projectId = req.params.id;
  const { title, description, category } = req.body;
  
  pool.query(
    "UPDATE projects SET title = ?, description = ?, category = ? WHERE id = ?",
    [title, description, category, projectId],
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