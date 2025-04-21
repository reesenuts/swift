import express from 'express';
import { registerUser, loginUser, forgetPass } from '../controllers/userController.js';

const router = express.Router();

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPass);

export default router;