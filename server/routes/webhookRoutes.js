import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

// Vonage delivery receipt webhook
router.post('/vonage/delivery-receipt', webhookController.handleDeliveryReceipt);

export default router; 