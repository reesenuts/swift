import express from 'express';
import { getAllUsers, deleteUser, toggleUserStatus } from '../../controllers/admin/userManagement.js';
import { verifyAdminToken } from '../../middleware/verifyAdminToken.js';

const router = express.Router();

router.get('/admin/users/all', verifyAdminToken, getAllUsers);
router.delete('/admin/users/:id', verifyAdminToken, deleteUser);
router.patch('/admin/users/:id/status', verifyAdminToken, toggleUserStatus);

export default router; 