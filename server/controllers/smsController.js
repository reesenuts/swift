import smsService from '../services/smsService.js';

export const sendTestSMS = async (req, res) => {
    try {
        console.log('Received SMS request:', req.body);
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            console.log('Missing required fields:', { phoneNumber: !!phoneNumber, message: !!message });
            return res.status(400).json({
                success: false,
                error: 'Phone number and message are required'
            });
        }

        // Vonage has a limit of 3200 characters per message segment
        if (message.length > 3200) {
            console.log('Message too long:', message.length);
            return res.status(400).json({
                success: false,
                error: 'Message length exceeds 3200 characters'
            });
        }

        console.log('Calling smsService.sendSMS with:', { phoneNumber, messageLength: message.length });
        const result = await smsService.sendSMS(phoneNumber, message);
        console.log('SMS service result:', result);

        if (result.success) {
            return res.json({
                success: true,
                messageId: result.messageId,
                status: result.status,
                to: result.to,
                remainingBalance: result.remainingBalance,
                network: result.network,
                details: result.details
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error,
                code: result.code,
                to: result.to
            });
        }
    } catch (error) {
        console.error('Error in sendTestSMS controller:', {
            error: error.message,
            stack: error.stack,
            body: req.body
        });
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
};

export const sendBulkSMS = async (req, res) => {
    try {
        const { phoneNumbers, message } = req.body;

        if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0 || !message) {
            return res.status(400).json({
                success: false,
                error: 'Phone numbers array and message are required'
            });
        }

        // Vonage has a limit of 3200 characters per message segment
        if (message.length > 3200) {
            return res.status(400).json({
                success: false,
                error: 'Message length exceeds 3200 characters'
            });
        }

        const result = await smsService.sendBulkSMS(phoneNumbers, message);

        if (result.success) {
            return res.json({
                success: true,
                totalSent: result.totalSent,
                totalFailed: result.totalFailed,
                details: result.details,
                failedNumbers: result.failedNumbers
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error,
                code: result.code,
                invalidNumbers: result.invalidNumbers
            });
        }
    } catch (error) {
        console.error('Error in sendBulkSMS controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }

        const result = await smsService.getMessageStatus(messageId);

        if (result.success) {
            return res.json({
                success: true,
                messageId: result.messageId,
                status: result.status,
                to: result.to,
                from: result.from,
                type: result.type,
                errorCode: result.errorCode,
                errorText: result.errorText,
                network: result.network,
                price: result.price,
                dateSubmitted: result.dateSubmitted,
                dateFinalized: result.dateFinalized,
                dateReceived: result.dateReceived,
                latency: result.latency
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error,
                code: result.code
            });
        }
    } catch (error) {
        console.error('Error in getMessageStatus controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getBalance = async (req, res) => {
    try {
        const result = await smsService.getBalance();

        if (result.success) {
            return res.json({
                success: true,
                balance: result.balance,
                autoReload: result.autoReload
            });
        } else {
            return res.status(400).json({
                success: false,
                error: result.error,
                code: result.code
            });
        }
    } catch (error) {
        console.error('Error in getBalance controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 