import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    connectionLimit: 10
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection error:', err.message);
        throw err;
    }
    console.log('MySQL connected successfully!');
    connection.release();
});

export default db;