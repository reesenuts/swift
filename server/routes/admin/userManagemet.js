import express from 'express';
import { getAllUsers, deleteUser, toggleUserStatus} from '../../controllers/admin/userManagement.js';
import { verifyToken } from '../../middleware/verifyToken.js';

const router = express.Router();

router.get('/admin/users/all', getAllUsers);
router.delete('/admin/users/:id', deleteUser);
router.patch('/admin/users/:id/status', toggleUserStatus);

export default router;