import jwt from 'jsonwebtoken';

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: admins only' });
    }
    
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};