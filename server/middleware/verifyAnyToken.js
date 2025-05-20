import jwt from 'jsonwebtoken';

export const verifyAnyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Accept both user and admin roles
    if (decoded.role !== 'user' && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Valid user or admin token required' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}; 