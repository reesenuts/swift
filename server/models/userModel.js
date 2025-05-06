import db from '../config/db.js';


//get all user for user-management
export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, role, created_at FROM users';
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);  // Reject the promise if there's an error
        } else {
          resolve(results);  // Resolve the promise with the results
        }
      });
    });
  };

  // Delete user by ID
export const deleteUserById = (id, callback) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], callback);
};

// Toggle user active status
export const setUserStatus = (id, is_active, callback) => {
  const sql = 'UPDATE users SET is_active = ? WHERE id = ?';
  db.query(sql, [is_active, id], callback);
};

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
