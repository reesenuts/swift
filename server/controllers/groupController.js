import db from '../config/db.js';

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Group name is required' });
        }

        db.query(
            'INSERT INTO groups (name, description) VALUES (?, ?)',
            [name, description || null],
            (err, result) => {
                if (err) {
                    console.error('Error creating group:', err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ 
                            success: false, 
                            message: 'Group name already exists' 
                        });
                    }
                    return res.status(500).json({ success: false, message: 'Error creating group' });
                }
                res.status(201).json({
                    success: true,
                    data: { id: result.insertId, name, description }
                });
            }
        );
    } catch (error) {
        console.error('Error in createGroup:', error);
        res.status(500).json({ success: false, message: 'Error creating group' });
    }
};

// Get all groups
export const getAllGroups = async (req, res) => {
    db.query('SELECT * FROM groups', (err, results) => {
        if (err) {
            console.error('Error fetching groups:', err);
            return res.status(500).json({ success: false, message: 'Error fetching groups' });
        }
        res.json({ success: true, data: results });
    });
};

// Get a single group
export const getGroup = async (req, res) => {
    const groupId = req.params.id;
    
    db.query(
        'SELECT * FROM groups WHERE id = ?',
        [groupId],
        (err, results) => {
            if (err) {
                console.error('Error fetching group:', err);
                return res.status(500).json({ success: false, message: 'Error fetching group' });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Group not found' });
            }
            res.json({ success: true, data: results[0] });
        }
    );
};

// Update a group
export const updateGroup = async (req, res) => {
    const groupId = req.params.id;
    const { name, description } = req.body;

    db.query(
        'UPDATE groups SET name = ?, description = ? WHERE id = ?',
        [name, description, groupId],
        (err, result) => {
            if (err) {
                console.error('Error updating group:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Group name already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error updating group' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Group not found' });
            }
            res.json({ success: true, message: 'Group updated successfully' });
        }
    );
};

// Delete a group
export const deleteGroup = async (req, res) => {
    const groupId = req.params.id;

    db.query(
        'DELETE FROM groups WHERE id = ?',
        [groupId],
        (err, result) => {
            if (err) {
                console.error('Error deleting group:', err);
                return res.status(500).json({ success: false, message: 'Error deleting group' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Group not found' });
            }
            res.json({ success: true, message: 'Group deleted successfully' });
        }
    );
};

// Add contacts to a group
export const addContactsToGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { contactIds } = req.body;

        if (!Array.isArray(contactIds) || contactIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Contact IDs array is required' 
            });
        }

        // Verify group exists
        db.query(
            'SELECT id FROM groups WHERE id = ?',
            [groupId],
            (err, groups) => {
                if (err) {
                    console.error('Error verifying group:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error adding contacts to group' 
                    });
                }

                if (groups.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Group not found' 
                    });
                }

                // Create values for bulk insert
                const values = contactIds.map(contactId => [contactId, groupId]);
                
                db.query(
                    'INSERT IGNORE INTO contact_groups (contact_id, group_id) VALUES ?',
                    [values],
                    (err) => {
                        if (err) {
                            console.error('Error adding contacts to group:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error adding contacts to group' 
                            });
                        }
                        res.json({ 
                            success: true, 
                            message: 'Contacts added to group successfully' 
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error in addContactsToGroup:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding contacts to group' 
        });
    }
};

// Remove a contact from a group
export const removeContactFromGroup = async (req, res) => {
    const { id: groupId, contactId } = req.params;

    db.query(
        'DELETE FROM contact_groups WHERE contact_id = ? AND group_id = ?',
        [contactId, groupId],
        (err, result) => {
            if (err) {
                console.error('Error removing contact from group:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error removing contact from group' 
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Contact not found in group' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Contact removed from group successfully' 
            });
        }
    );
};

// Get all contacts in a group
export const getGroupContacts = async (req, res) => {
    const groupId = req.params.id;

    db.query(
        `SELECT c.* 
        FROM contacts c
        INNER JOIN contact_groups cg ON c.id = cg.contact_id
        WHERE cg.group_id = ? AND c.is_active = TRUE`,
        [groupId],
        (err, contacts) => {
            if (err) {
                console.error('Error fetching group contacts:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching group contacts' 
                });
            }
            res.json({ success: true, data: contacts });
        }
    );
};

// Get single group by ID
export const getGroupById = async (req, res) => {
    const groupId = req.params.id;
    
    db.query(
        'SELECT * FROM groups WHERE id = ?',
        [groupId],
        (err, results) => {
            if (err) {
                console.error('Error fetching group:', err);
                return res.status(500).json({ success: false, message: 'Error fetching group' });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Group not found' });
            }
            res.json({ success: true, data: results[0] });
        }
    );
};

// Send SMS to all contacts in a group
export const sendSMSToGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { message, title } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message content is required' 
            });
        }

        // First, verify the group exists and belongs to the user
        db.query(
            'SELECT * FROM groups WHERE id = ?',
            [groupId],
            async (err, groups) => {
                if (err) {
                    console.error('Error verifying group:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error sending SMS to group' 
                    });
                }

                if (groups.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Group not found' 
                    });
                }

                // Get all contacts in the group
                db.query(
                    `SELECT c.* 
                    FROM contacts c
                    INNER JOIN contact_groups cg ON c.id = cg.contact_id
                    WHERE cg.group_id = ? AND c.is_active = TRUE`,
                    [groupId],
                    async (err, contacts) => {
                        if (err) {
                            console.error('Error fetching group contacts:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error fetching group contacts for SMS' 
                            });
                        }

                        if (contacts.length === 0) {
                            return res.status(400).json({ 
                                success: false, 
                                message: 'Group has no contacts to send SMS to' 
                            });
                        }

                        // Extract phone numbers from contacts
                        const phoneNumbers = contacts.map(contact => contact.phone_number);
                        
                        try {
                            // Import smsService dynamically
                            const smsModule = await import('../services/smsService.js');
                            const smsService = smsModule.default;
                            
                            // Send bulk SMS
                            const result = await smsService.sendBulkSMS(phoneNumbers, message);
                            
                            if (result.success) {
                                // Save message details in the database
                                try {
                                    // Import messageService dynamically
                                    const messageModule = await import('../services/messageService.js');
                                    const messageService = messageModule.default;
                                    
                                    // For each successfully sent message
                                    for (let i = 0; i < result.details.length; i++) {
                                        const messageResult = result.details[i];
                                        if (messageResult.success) {
                                            await messageService.createMessage({
                                                message_id: messageResult.messageId,
                                                phone_number: messageResult.to,
                                                message_text: message,
                                                title: title || null,
                                                user_id: userId,
                                                group_id: groupId
                                            });
                                        }
                                    }
                                } catch (dbError) {
                                    console.error('Error saving group message details:', dbError);
                                }
                                
                                return res.json({
                                    success: true,
                                    message: 'SMS sent to group contacts',
                                    totalSent: result.totalSent,
                                    totalFailed: result.totalFailed,
                                    failedNumbers: result.failedNumbers
                                });
                            } else {
                                return res.status(400).json({
                                    success: false,
                                    message: 'Failed to send SMS to group contacts',
                                    error: result.error
                                });
                            }
                        } catch (smsError) {
                            console.error('Error sending SMS to group:', smsError);
                            return res.status(500).json({
                                success: false, 
                                message: 'Error sending SMS to group',
                                error: smsError.message
                            });
                        }
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error in sendSMSToGroup:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending SMS to group',
            error: error.message
        });
    }
};
