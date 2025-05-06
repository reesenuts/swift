import { getAllUsers as getAllUsersFromDB, createUser, getUser, updatePass } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//user-management get all user
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDB(); // Fetch users from the database
    if (users && Array.isArray(users)) {
      return res.json({ success: true, users }); // Make sure to send users as part of the response
    } else {
      return res.status(404).json({ success: false, message: 'No users found.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

export const fetchCurrentUser = async (req, res) => {
  try {
    const { username, email } = req.user;
    return res.json({ success: true, data: username, email });
  } catch (error) {
    console.error('Fetching my credentials error:', error);
    return res.status(500).json({ success: false, message: 'Server error during fetch.', error: error.message });
  }
};

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

const getUserAsync = (email) => {
  return new Promise((resolve, reject) => {
    getUser(email, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const username = email.split('@')[0]; 
    const role = 'user';
        // Check if the body is empty
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        // Check if email  is a valid format
        if (!isValidEmail(email)) {
          return res.status(400).json({ success: false, message: "Invalid email format." });
        }
        // Check if Password is at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number
        if (!isStrongPassword(password)) {
          return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number." });
        }

    try {
      // Check if user exists
      getUser(email, async (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error checking user existence.', error: err.message });
        }
        // Check if email already exists
        if (results.length > 0) {
          return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to DB
        createUser(username, email, hashedPassword, role, (err, result) => {
          if (err) {
            const errorMessage =
              err.code === 'ER_DUP_ENTRY' ? 'User already exists.' : 'DB error';
            return res.status(500).json({
              success: false,
              message: errorMessage,
              error: err.message
            });
          }
          return res.status(201).json({ success: true, message: 'User registered successfully!', user: { username, email, role }});
        });
      });
    } catch (error) {
      console.error('Error during user registration:', error);
      return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
    }
}; 

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
       // Check if the body is empty
       if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
      }
    try {
      getUser(email, async (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error fetching user.' });
        }

        if (results.length === 0) {
          return res.status(404).json({ success: false, message: "Email not found." });
        }
        const user = results[0];

        // Compare password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(400).json({ success: false, message:"Invalid email or password." });
        }

        //Generate token
        const token = jwt.sign(
          { id: user.id, role: user.role, username: user.username, email: user.email },
           process.env.JWT_SECRET,
          { expiresIn: '1h' }
          );

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
          sameSite: 'Strict',
        });
        return res.status(200).json({ 
          success: true,
          message: 'Login successfully.', 
          token: token,
          user: {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username
        }});
      });
    } catch (error) {
      console.error('Error during user login:', error);
      return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    return res.status(200).json({ success: true, message: 'Logout successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Server error during logout', error: error.messgae });
  }
};


// export const forgetPass = async (req, res) => {
//   const { email, newPassword } = req.body;

//   // Check if Password is at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number
//   if (!isStrongPassword(newPassword)) {
//     return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number." });
//   }
  
//   try {
//     // Check if the user exists
//     getUser(email, async (err,  results) => {
//       if (err) {
//         return res.status(500).json({ success: false, message: "Database error", error: err.message });
//       }
//       // Check if user exists
//       if (results.length === 0) {
//         return res.status(404).json({ success: false, message: "User not found." });
//       }

//       // Password hashing
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Update password
//       updatePass(email, hashedPassword, (err, result) => {
//         if (err) {
//           return res.status(500).json({ success : false, message: "Failed to update password.", error: err.message });
//         }

//         return res.status(200).json({ success: true, message: "Password reset successful." });
//       });
//     });
//   } catch (error) {
//     console.error('Error during password reset:', error.message);
//     return res.status(500).json({ success: false, message: "Error during password reset.", error: error.message });
//   }
// };

