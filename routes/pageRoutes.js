const express = require('express');
const path = require('path');
const router = express.Router();

// Define the basePath for the HTML files
const basePath = path.join(__dirname, '..', 'Website', 'html');

// Routes for HTML pages
router.get("/", (req, res) => {
  res.sendFile(path.join(basePath, "index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(basePath, "about.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(basePath, "contact.html"));
});

router.get("/freelancers", (req, res) => {
  res.sendFile(path.join(basePath, "freelancers.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(basePath, "login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(basePath, "sign-up.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(basePath, "profile.html"));
});

module.exports = router;