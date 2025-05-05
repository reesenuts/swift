
// export const verifyjwt = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Missing token.' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
//         req.user= user;
//         next();
//     });
// };

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
    req.user = decoded; // Attach user data to request
    next(); // Continue to route handler
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};