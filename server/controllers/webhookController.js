import messageService from '../services/messageService.js';

class WebhookController {
    async handleDeliveryReceipt(req, res) {
        try {
            const data = req.body;
            console.log('Received delivery receipt:', data);

            // Map Vonage status to our status
            const statusMap = {
                delivered: 'delivered',
                failed: 'failed',
                rejected: 'failed',
                accepted: 'sent',
                buffered: 'pending'
            };

            const status = statusMap[data.status] || data.status;

            await messageService.updateMessageStatus(data.messageId, {
                status: status,
                error_code: data['err-code'],
                error_message: data['error-text'],
                price: data.price,
                network: data.network
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error handling delivery receipt:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to process delivery receipt' 
            });
        }
    }
}

export default new WebhookController(); 