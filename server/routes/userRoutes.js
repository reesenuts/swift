import express from 'express';
import { registerUser, loginUser, forgetPass, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPass);
router.get('/all', getAllUsers);

export default router;