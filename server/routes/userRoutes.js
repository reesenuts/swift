import express from 'express';
import { registerUser, loginUser, forgetPass, getAllUsers} from '../controllers/userController.js';
// import { verifyApiKey } from '../middleware/verifyApiKey.js';

const router = express.Router();

router.get('/users/all', getAllUsers);

// Register User Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forget-password', forgetPass);


export default router;