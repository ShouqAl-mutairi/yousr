const nodemailer = require("nodemailer");
require('dotenv').config();

// Initialize nodemailer transporter
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',  // Using the service setting instead of host/port
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your app-specific password
    }
  });

  // Verify connection configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('SMTP connection error:', error);
      console.error('This may indicate issues with your email credentials or Gmail settings');
      console.error('Make sure you\'ve enabled "Less secure app access" or using an app password');
    } else {
      console.log('SMTP server connection successful! Email sending should work.');
    }
  });
} catch (error) {
  console.error('Error setting up email transporter:', error);
}

// Improved debugging for email configuration
console.log("EMAIL CONFIGURATION:");
console.log("- EMAIL_USER:", process.env.EMAIL_USER ? "Configured ✓" : "Missing ✗");
console.log("- EMAIL_PASS:", process.env.EMAIL_PASS ? "Configured ✓" : "Missing ✗");

module.exports = transporter;