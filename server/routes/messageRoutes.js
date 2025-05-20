import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import {
    getAllMessages,
    getMessageById,
    deleteMessage,
    getMessageStatusById,
    getDeliveryStats,
    getFailureRates
} from '../controllers/messageController.js';

const router = express.Router();

// Message Management Routes
router.post('/messages', verifyUserToken, (req, res) => {
    res.status(501).json({ success: false, error: "This endpoint is not yet implemented" });
});
router.get('/messages', verifyUserToken, getAllMessages);
router.get('/messages/:id', verifyUserToken, getMessageById);
router.delete('/messages/:id', verifyUserToken, deleteMessage);

// Message Status Routes
router.get('/messages/:id/status', verifyUserToken, getMessageStatusById);
router.get('/messages/analytics/delivery-stats', verifyUserToken, getDeliveryStats);
router.get('/messages/analytics/failure-rates', verifyUserToken, getFailureRates);

export default router; 