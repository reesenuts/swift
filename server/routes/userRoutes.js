import express from 'express';
import { registerUser, loginUser, logoutUser, fetchCurrentUser, getAllUsers} from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
// import { verifyApiKey } from '../middleware/verifyApiKey.js';

const router = express.Router();

router.get('/users/all', getAllUsers);

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/...', verifyToken, fetchCurrentUser);
// router.put('/forget-password', forgetPass);


export default router;