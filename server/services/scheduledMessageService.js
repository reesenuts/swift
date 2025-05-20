import pool from '../config/db.js';
import smsService from './smsService.js';

class ScheduledMessageService {
    /**
     * Create a scheduled message
     * @param {Object} data - Scheduled message data
     * @returns {Promise<Object>} Result
     */
    async createScheduledMessage(data) {
        const { message_text, scheduled_time, recipient_type, recipient_id } = data;
        
        try {
            const result = await pool.query(
                'INSERT INTO scheduled_messages (message_text, scheduled_time, recipient_type, recipient_id) VALUES (?, ?, ?, ?)',
                [message_text, scheduled_time, recipient_type, recipient_id]
            );
            
            return { 
                success: true, 
                id: result.insertId,
                message: 'Message scheduled successfully'
            };
        } catch (error) {
            console.error('Error creating scheduled message:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all scheduled messages
     * @param {Object} filters - Optional filters (status, scheduled_time, etc.)
     * @returns {Promise<Object>} Result with scheduled messages
     */
    async getScheduledMessages(filters = {}) {
        try {
            let query = 'SELECT * FROM scheduled_messages';
            const queryParams = [];
            
            // Apply filters if provided
            if (Object.keys(filters).length > 0) {
                query += ' WHERE';
                
                if (filters.status) {
                    query += ' status = ?';
                    queryParams.push(filters.status);
                }
                
                if (filters.fromDate) {
                    query += (queryParams.length > 0 ? ' AND' : '') + ' scheduled_time >= ?';
                    queryParams.push(filters.fromDate);
                }
                
                if (filters.toDate) {
                    query += (queryParams.length > 0 ? ' AND' : '') + ' scheduled_time <= ?';
                    queryParams.push(filters.toDate);
                }
            }
            
            // Sort by scheduled time
            query += ' ORDER BY scheduled_time ASC';
            
            return new Promise((resolve, reject) => {
                pool.query(query, queryParams, (err, rows) => {
                    if (err) {
                        console.error('Error in database query:', err);
                        return resolve({ success: false, error: err.message });
                    }
                    
                    // Return serializable data
                    const messages = JSON.parse(JSON.stringify(rows));
                    resolve({ success: true, messages: messages });
                });
            });
        } catch (error) {
            console.error('Error getting scheduled messages:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get a scheduled message by ID
     * @param {number} id - Scheduled message ID
     * @returns {Promise<Object>} Result with scheduled message
     */
    async getScheduledMessageById(id) {
        try {
            return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM scheduled_messages WHERE id = ?', [id], (err, rows) => {
                    if (err) {
                        console.error('Error in database query:', err);
                        return resolve({ success: false, error: err.message });
                    }
                    
                    if (rows.length === 0) {
                        return resolve({ 
                            success: false, 
                            error: 'Scheduled message not found' 
                        });
                    }
                    
                    // Return serializable data
                    const message = JSON.parse(JSON.stringify(rows[0]));
                    resolve({ success: true, message: message });
                });
            });
        } catch (error) {
            console.error('Error getting scheduled message:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update a scheduled message
     * @param {number} id - Scheduled message ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Result
     */
    async updateScheduledMessage(id, data) {
        try {
            const { message_text, scheduled_time, recipient_type, recipient_id, status } = data;
            
            const result = await pool.query(
                `UPDATE scheduled_messages 
                SET message_text = IFNULL(?, message_text), 
                    scheduled_time = IFNULL(?, scheduled_time), 
                    recipient_type = IFNULL(?, recipient_type), 
                    recipient_id = IFNULL(?, recipient_id),
                    status = IFNULL(?, status)
                WHERE id = ?`,
                [message_text, scheduled_time, recipient_type, recipient_id, status, id]
            );
            
            if (result.affectedRows === 0) {
                return { 
                    success: false, 
                    error: 'Scheduled message not found' 
                };
            }
            
            return { 
                success: true, 
                message: 'Scheduled message updated successfully' 
            };
        } catch (error) {
            console.error('Error updating scheduled message:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete a scheduled message
     * @param {number} id - Scheduled message ID
     * @returns {Promise<Object>} Result
     */
    async deleteScheduledMessage(id) {
        try {
            const result = await pool.query('DELETE FROM scheduled_messages WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return { 
                    success: false, 
                    error: 'Scheduled message not found' 
                };
            }
            
            return { 
                success: true, 
                message: 'Scheduled message deleted successfully' 
            };
        } catch (error) {
            console.error('Error deleting scheduled message:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Process messages that are due for sending
     * @returns {Promise<Object>} Result with processed messages
     */
    async processScheduledMessages() {
        try {
            // Get all pending messages that are due - use local time format
            const now = new Date();
            console.log(`Processing scheduled messages at local time: ${now.toString()}`);
            
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            console.log(`Formatted current time for DB comparison: ${currentTime}`);
            
            // Log all pending messages for debugging
            const pendingMessages = await new Promise((resolvePending) => {
                pool.query('SELECT * FROM scheduled_messages WHERE status = ?', ['pending'], (err, rows) => {
                    if (err) {
                        console.error('Error fetching pending messages:', err);
                        resolvePending([]);
                    } else {
                        console.log(`Found ${rows.length} pending messages in database:`);
                        rows.forEach(msg => {
                            console.log(`ID: ${msg.id}, Time: ${msg.scheduled_time}, Message: ${msg.message_text.substring(0, 30)}...`);
                        });
                        resolvePending(rows);
                    }
                });
            });
            
            return new Promise((resolve, reject) => {
                pool.query(
                    'SELECT * FROM scheduled_messages WHERE status = ? AND scheduled_time <= ?',
                    ['pending', currentTime],
                    async (err, messages) => {
                        if (err) {
                            console.error('Error in database query:', err);
                            return resolve({ success: false, error: err.message });
                        }
                        
                        if (messages.length === 0) {
                            return resolve({ success: true, processed: 0, message: 'No messages to process' });
                        }
                        
                        try {
                            // Update status to queued
                            const ids = messages.map(m => m.id);
                            await new Promise((resolveUpdate, rejectUpdate) => {
                                pool.query(
                                    'UPDATE scheduled_messages SET status = ? WHERE id IN (?)',
                                    ['queued', ids],
                                    (updateErr) => {
                                        if (updateErr) {
                                            rejectUpdate(updateErr);
                                        } else {
                                            resolveUpdate();
                                        }
                                    }
                                );
                            });
                            
                            // Process messages converted to plain objects
                            const plainMessages = JSON.parse(JSON.stringify(messages));
                            
                            // Send each message
                            const results = await Promise.all(plainMessages.map(async (message) => {
                                try {
                                    let result;
                                    
                                    if (message.recipient_type === 'single') {
                                        // Get contact phone number
                                        const contacts = await new Promise((resolveContacts, rejectContacts) => {
                                            pool.query(
                                                'SELECT phone_number FROM contacts WHERE id = ?',
                                                [message.recipient_id],
                                                (contactErr, contactResult) => {
                                                    if (contactErr) {
                                                        rejectContacts(contactErr);
                                                    } else {
                                                        resolveContacts(contactResult);
                                                    }
                                                }
                                            );
                                        });
                                        
                                        if (contacts.length === 0) {
                                            await this.updateScheduledMessage(message.id, { status: 'failed' });
                                            return { 
                                                id: message.id, 
                                                success: false, 
                                                error: 'Contact not found' 
                                            };
                                        }
                                        
                                        result = await smsService.sendSMS(contacts[0].phone_number, message.message_text);
                                    } else if (message.recipient_type === 'group') {
                                        // Get all contacts in the group
                                        const contacts = await new Promise((resolveGroupContacts, rejectGroupContacts) => {
                                            pool.query(
                                                `SELECT c.phone_number 
                                                FROM contacts c
                                                JOIN contact_groups cg ON c.id = cg.contact_id
                                                WHERE cg.group_id = ? AND c.is_active = 1`,
                                                [message.recipient_id],
                                                (groupErr, groupResult) => {
                                                    if (groupErr) {
                                                        rejectGroupContacts(groupErr);
                                                    } else {
                                                        resolveGroupContacts(groupResult);
                                                    }
                                                }
                                            );
                                        });
                                        
                                        if (contacts.length === 0) {
                                            await this.updateScheduledMessage(message.id, { status: 'failed' });
                                            return { 
                                                id: message.id, 
                                                success: false, 
                                                error: 'No contacts found in group' 
                                            };
                                        }
                                        
                                        const phoneNumbers = contacts.map(c => c.phone_number);
                                        result = await smsService.sendBulkSMS(phoneNumbers, message.message_text);
                                    }
                                    
                                    // Update status based on result
                                    await this.updateScheduledMessage(
                                        message.id, 
                                        { status: result.success ? 'sent' : 'failed' }
                                    );
                                    
                                    return { 
                                        id: message.id, 
                                        success: result.success, 
                                        details: result 
                                    };
                                } catch (error) {
                                    await this.updateScheduledMessage(message.id, { status: 'failed' });
                                    return { 
                                        id: message.id, 
                                        success: false, 
                                        error: error.message 
                                    };
                                }
                            }));
                            
                            const successful = results.filter(r => r.success).length;
                            const failed = results.length - successful;
                            
                            // Return a serializable result
                            const serializedResults = JSON.parse(JSON.stringify(results));
                            
                            resolve({
                                success: true,
                                processed: results.length,
                                successful,
                                failed,
                                results: serializedResults
                            });
                        } catch (error) {
                            console.error('Error processing scheduled messages:', error);
                            resolve({
                                success: false,
                                error: error.message
                            });
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error in processScheduledMessages:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new ScheduledMessageService(); 