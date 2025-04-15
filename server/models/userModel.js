import db from '../config/db.js';

// Register user
export const createUser = (username, email, password, role, callback) => {
    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, password, role], callback);
}; 

// Login user
export const getUser = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
};

export const updatePass = (email, newPassword, callback) => {
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sql, [newPassword, email], callback);
;}
