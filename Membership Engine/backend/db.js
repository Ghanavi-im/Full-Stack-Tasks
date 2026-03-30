const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'membership_engine',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection((err, conn) => {
    if (err) {
        console.error('Error connecting to the database: ', err.message);
    } else {
        console.log('Successfully connected to MySQL database.');
        conn.release();
    }
});

// Export a promise-based pool for easier async/await usage
module.exports = db.promise();
