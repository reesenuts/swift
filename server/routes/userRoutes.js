import express from 'express';
import { registerUser, loginUser, logoutUser, fetchCurrentUser } from '../controllers/userController.js';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import { verifyAdminToken } from '../middleware/verifyAdminToken.js';

const router = express.Router();

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyAdminToken, fetchCurrentUser);
// router.put('/forget-password', forgetPass);


export default router;