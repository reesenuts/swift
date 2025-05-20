import express from 'express';
import { sendTestSMS, sendBulkSMS, getMessageStatus, getBalance } from '../controllers/smsController.js';
import { verifyUserToken } from '../middleware/verifyUserToken.js';

const router = express.Router();

// SMS routes
router.post('/sms/send', verifyUserToken, sendTestSMS);
router.post('/sms/bulk', verifyUserToken, sendBulkSMS);
router.get('/sms/status/:messageId', verifyUserToken, getMessageStatus);
router.get('/sms/balance', verifyUserToken, getBalance);

export default router; 