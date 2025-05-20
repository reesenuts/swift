import readline from 'readline';
import bcrypt from 'bcrypt';
import { createUser } from '../models/userModel.js';
import db from '../config/db.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation regex
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

async function promptAdminRegistration() {
  rl.question('Enter admin email: ', (email) => {
    if (!email || email.trim() === '') {
      console.error('Email is required.');
      rl.close();
      db.end();
      return;
    }
    // Check if email is valid
    if (!isValidEmail(email)) {
      console.error('Invalid email format.');
      rl.close();
      db.end();
      return;
    }

    rl.question('Enter password: ', async (password) => {
      if (!password || password.trim() === '') {
        console.error('Password is required.');
        rl.close();
        db.end();
        return;
      }
      // Check if Password is at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number
      if (!isStrongPassword(password)) {
        console.error('Password must be at least 8 characters long and include uppercase, lowercase, and a number.');
        rl.close();
        db.end();
        return;
      }

      const username = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = 'admin';

      createUser(username, email, hashedPassword, role, true, (err, result) => {
        if (err) {
          console.error('Error creating admin:', err.message);
        } else {
          console.log('Admin created successfully!');
        }
        rl.close();
        db.end();
      });
    });
  });
}

promptAdminRegistration();
