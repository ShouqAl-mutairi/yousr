const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Load configuration
require('dotenv').config(); // Load environment variables

// Import routes
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data

// Serving static website
app.use(express.static(path.join(__dirname, "Website")));

// Setup routes
app.use('/', pageRoutes);
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/', authRoutes);
app.use('/', contactRoutes);

// Activating server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
