const mysql = require('mysql2');
const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  port:process.env.DB_PORT,
  database:process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,    //1以上
  queueLimit:0   
});

module.exports = pool.promise(); 