import express from 'express';
import { registerUser, loginUser, logoutUser, fetchCurrentUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/...', verifyToken, fetchCurrentUser);
// router.put('/forget-password', forgetPass);


export default router;