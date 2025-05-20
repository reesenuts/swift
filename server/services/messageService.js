import pool from '../config/db.js';

class MessageService {
    async createMessage(messageData) {
        const { 
            message_id, 
            phone_number, 
            message_text, 
            title = null, 
            user_id = null, 
            group_id = null 
        } = messageData;
        
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO messages (message_id, phone_number, message_text, title, user_id, group_id) VALUES (?, ?, ?, ?, ?, ?)',
                [message_id, phone_number, message_text, title, user_id, group_id],
                (error, result) => {
                    if (error) {
                        console.error('Error creating message record:', error);
                        resolve({
                            success: false,
                            error: error.message
                        });
                        return;
                    }
                    
                    resolve({
                        success: true,
                        id: result.insertId
                    });
                }
            );
        });
    }

    async updateMessageStatus(messageId, statusData) {
        const { status, error_code, error_message, price, network } = statusData;
        
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE messages 
                SET status = ?, 
                    error_code = ?, 
                    error_message = ?,
                    price = ?,
                    network = ?
                WHERE message_id = ?`,
                [status, error_code, error_message, price, network, messageId],
                (error, result) => {
                    if (error) {
                        console.error('Error updating message status:', error);
                        resolve({
                            success: false,
                            error: error.message
                        });
                        return;
                    }
                    
                    resolve({
                        success: true,
                        updated: result.affectedRows > 0,
                        messageId
                    });
                }
            );
        });
    }

    async getMessageStatus(messageId) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM messages WHERE message_id = ?',
                [messageId],
                (error, rows) => {
                    if (error) {
                        console.error('Error fetching message status:', error);
                        resolve({
                            success: false,
                            error: error.message
                        });
                        return;
                    }
                    
                    if (rows.length === 0) {
                        resolve({
                            success: false,
                            error: 'Message not found',
                            code: 'message_not_found'
                        });
                        return;
                    }

                    const message = rows[0];
                    resolve({
                        success: true,
                        messageId: message.message_id,
                        status: message.status,
                        phoneNumber: message.phone_number,
                        message: message.message_text,
                        errorCode: message.error_code,
                        errorMessage: message.error_message,
                        price: message.price,
                        network: message.network,
                        createdAt: message.created_at,
                        updatedAt: message.updated_at
                    });
                }
            );
        });
    }

    async getAllMessages() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM messages ORDER BY created_at DESC', (error, rows) => {
                if (error) {
                    console.error('Error fetching all messages:', error);
                    resolve({
                        success: false,
                        error: error.message
                    });
                    return;
                }
                
                resolve({
                    success: true,
                    messages: rows
                });
            });
        });
    }

    async getMessageById(id) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM messages WHERE id = ?', [id], (error, rows) => {
                if (error) {
                    console.error('Error fetching message by ID:', error);
                    resolve({
                        success: false,
                        error: error.message
                    });
                    return;
                }
                
                if (rows.length === 0) {
                    resolve({
                        success: false,
                        error: 'Message not found',
                        code: 'message_not_found'
                    });
                    return;
                }

                resolve({
                    success: true,
                    message: rows[0]
                });
            });
        });
    }

    async deleteMessage(id) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM messages WHERE id = ?', [id], (error, result) => {
                if (error) {
                    console.error('Error deleting message:', error);
                    resolve({
                        success: false,
                        error: error.message
                    });
                    return;
                }
                
                if (result.affectedRows === 0) {
                    resolve({
                        success: false,
                        error: 'Message not found',
                        code: 'message_not_found'
                    });
                    return;
                }

                resolve({
                    success: true,
                    message: 'Message deleted successfully'
                });
            });
        });
    }

    async getDeliveryStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    status, 
                    COUNT(*) as count,
                    (COUNT(*) / (SELECT COUNT(*) FROM messages)) * 100 as percentage
                FROM messages 
                GROUP BY status
            `;
            
            pool.query(query, (error, result) => {
                if (error) {
                    console.error('Error fetching delivery stats:', error);
                    resolve({
                        success: false,
                        error: error.message
                    });
                    return;
                }

                resolve({
                    success: true,
                    stats: result
                });
            });
        });
    }

    async getFailureRates() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                    (SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as failure_rate
                FROM messages
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `;
            
            pool.query(query, (error, result) => {
                if (error) {
                    console.error('Error fetching failure rates:', error);
                    resolve({
                        success: false,
                        error: error.message
                    });
                    return;
                }

                resolve({
                    success: true,
                    rates: result
                });
            });
        });
    }
}

export default new MessageService(); 