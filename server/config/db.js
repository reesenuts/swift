import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
});

const dbReady = new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('MySQL connection error:', err.message);
        reject(err);
      } else {
        console.log('MySQL connected successfully!');
        resolve();
      }
    });
  });
  
  export default db;
  export { dbReady };