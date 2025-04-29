const mysql = require("mysql2");

// Setting up database connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "yousr",
  port: 3306,
});

module.exports = pool;