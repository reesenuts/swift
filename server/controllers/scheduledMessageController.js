import scheduledMessageService from '../services/scheduledMessageService.js';

/**
 * Schedule a new message
 */
export const scheduleMessage = async (req, res) => {
    try {
        const { message, scheduled_time, recipient_type, recipient_id } = req.body;

        // Validate required fields
        if (!message || !scheduled_time || !recipient_type || !recipient_id) {
            return res.status(400).json({
                success: false,
                error: 'Message, scheduled time, recipient type, and recipient ID are required'
            });
        }

        // Validate recipient type
        if (!['single', 'group'].includes(recipient_type)) {
            return res.status(400).json({
                success: false,
                error: 'Recipient type must be "single" or "group"'
            });
        }

        // Vonage has a limit of 3200 characters per message segment
        if (message.length > 3200) {
            return res.status(400).json({
                success: false,
                error: 'Message length exceeds 3200 characters'
            });
        }

        // Check if scheduled time is in the future
        const scheduledTime = new Date(scheduled_time);
        const now = new Date();
        if (scheduledTime <= now) {
            return res.status(400).json({
                success: false,
                error: 'Scheduled time must be in the future'
            });
        }

        const result = await scheduledMessageService.createScheduledMessage({
            message_text: message,
            scheduled_time: scheduled_time,
            recipient_type,
            recipient_id
        });

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in scheduleMessage controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Get all scheduled messages with optional filters
 */
export const getScheduledMessages = async (req, res) => {
    try {
        const filters = {};
        
        // Extract filters from query parameters
        if (req.query.status) filters.status = req.query.status;
        if (req.query.fromDate) filters.fromDate = req.query.fromDate;
        if (req.query.toDate) filters.toDate = req.query.toDate;

        const result = await scheduledMessageService.getScheduledMessages(filters);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in getScheduledMessages controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Get a scheduled message by ID
 */
export const getScheduledMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }

        const result = await scheduledMessageService.getScheduledMessageById(id);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getScheduledMessageById controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Update a scheduled message
 */
export const updateScheduledMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, scheduled_time, recipient_type, recipient_id, status } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }

        // Check if no update fields provided
        if (!message && !scheduled_time && !recipient_type && !recipient_id && !status) {
            return res.status(400).json({
                success: false,
                error: 'At least one field to update is required'
            });
        }

        // Validate recipient type if provided
        if (recipient_type && !['single', 'group'].includes(recipient_type)) {
            return res.status(400).json({
                success: false,
                error: 'Recipient type must be "single" or "group"'
            });
        }

        // Check if message length is valid if provided
        if (message && message.length > 3200) {
            return res.status(400).json({
                success: false,
                error: 'Message length exceeds 3200 characters'
            });
        }

        // Check if scheduled time is in the future if provided
        if (scheduled_time) {
            const scheduledTime = new Date(scheduled_time);
            const now = new Date();
            if (scheduledTime <= now) {
                return res.status(400).json({
                    success: false,
                    error: 'Scheduled time must be in the future'
                });
            }
        }

        const result = await scheduledMessageService.updateScheduledMessage(id, {
            message_text: message,
            scheduled_time,
            recipient_type,
            recipient_id,
            status
        });

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in updateScheduledMessage controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Delete a scheduled message
 */
export const deleteScheduledMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }

        const result = await scheduledMessageService.deleteScheduledMessage(id);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in deleteScheduledMessage controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Process scheduled messages that are due
 */
export const processScheduledMessages = async (req, res) => {
    try {
        const result = await scheduledMessageService.processScheduledMessages();
        return res.json(result);
    } catch (error) {
        console.error('Error in processScheduledMessages controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 