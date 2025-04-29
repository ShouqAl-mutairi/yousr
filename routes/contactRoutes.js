const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const transporter = require('../config/email');
const contactValidation = require('../validators/contactValidator');

router.post("/contact", contactValidation, (req, res) => {
  console.log("Incoming request headers:", req.headers);
  console.log("Incoming request body:", req.body);

  // Check if firstName is null or empty
  if (!req.body.firstName || req.body.firstName.trim() === "") {
    console.error("First name is missing or empty:", req.body.firstName);
    return res.status(400).json({
      success: false,
      message: "الاسم الأول مطلوب ولكنه غير موجود في الطلب",
      errors: [{ msg: "الاسم الأول مطلوب ولكنه غير موجود في الطلب" }]
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "فشل في إرسال الرسالة",
      errors: errors.array()
    });
  }

  const { firstName, 'last-name': lastName, email, phone, message } = req.body;

  console.log('Data received:', { firstName, lastName, email, phone, message });

  //Set up email
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER || 'shooglifa@icloud.com', // Use the email from .env file
    subject: `رسالة جديدة من ${firstName} ${lastName}`,
    text: `
      الاسم الأول: ${firstName}
      الاسم الأخير: ${lastName}
      البريد الإلكتروني: ${email}
      رقم الجوال: ${phone}
      الرسالة:
      ${message}
    `,
    html: `
      <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #7e70fa;">رسالة جديدة من موقع يُسر</h2>
        <p><strong>الاسم الأول:</strong> ${firstName}</p>
        <p><strong>الاسم الأخير:</strong> ${lastName}</p>
        <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>رقم الجوال:</strong> ${phone}</p>
        <p><strong>الرسالة:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `
  };

  // إرسال البريد الإلكتروني
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إرسال الرسالة',
        error: error.message, // Include the error message
        details: error.toString() // Include more details about the error
      });
    }
    console.log('Email sent: ' + info.response);


    res.status(200).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنقوم بالتواصل معك قريبًا.',
      data: {
        firstName,
        lastName,
        email,
        phone,
        message
      }
    });
  });
});

module.exports = router;