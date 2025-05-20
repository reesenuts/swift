import messageService from '../services/messageService.js';

// Get all messages
export const getAllMessages = async (req, res) => {
    try {
        const result = await messageService.getAllMessages();
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error in getAllMessages controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Get a message by ID
export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }
        
        const result = await messageService.getMessageById(id);
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getMessageById controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }
        
        const result = await messageService.deleteMessage(id);
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in deleteMessage controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Get message status
export const getMessageStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }
        
        const result = await messageService.getMessageStatus(id);
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getMessageStatusById controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Get delivery statistics
export const getDeliveryStats = async (req, res) => {
    try {
        const result = await messageService.getDeliveryStats();
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error in getDeliveryStats controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Get failure rates
export const getFailureRates = async (req, res) => {
    try {
        const result = await messageService.getFailureRates();
        
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error in getFailureRates controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 