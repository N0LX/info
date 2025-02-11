const mysql = require("mysql2");
const config = require("./config");
require('dotenv').config(); 
// const pool = mysql.createPool({
//   host: config.HOST,
//   user: config.USERNAME,
//   password: config.PASSWORD,
//   database: config.DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10, 
//   idleTimeout: 60000, 
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0});

// Test Connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log(" Connected to Clever Cloud MySQL Database!");
    connection.release();
  }
});

module.exports = pool.promise();
