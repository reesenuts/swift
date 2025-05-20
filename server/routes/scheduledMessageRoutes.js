import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import {
    scheduleMessage,
    getScheduledMessages,
    getScheduledMessageById,
    updateScheduledMessage,
    deleteScheduledMessage,
    processScheduledMessages
} from '../controllers/scheduledMessageController.js';

const router = express.Router();

// Scheduled message routes (all protected)
router.post('/schedule', verifyUserToken, scheduleMessage);
router.get('/schedule', verifyUserToken, getScheduledMessages);
router.get('/schedule/:id', verifyUserToken, getScheduledMessageById);
router.put('/schedule/:id', verifyUserToken, updateScheduledMessage);
router.delete('/schedule/:id', verifyUserToken, deleteScheduledMessage);
router.post('/schedule/process', verifyUserToken, processScheduledMessages);

export default router; 