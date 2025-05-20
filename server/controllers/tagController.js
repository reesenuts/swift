import db from '../config/db.js';

// Create a new tag
export const createTag = (req, res) => {
    const { name } = req.body;
    const userId = req.userId; // Assuming userId is available from auth middleware

    if (!name) {
        return res.status(400).json({ success: false, message: 'Tag name is required' });
    }

    db.query(
        'INSERT INTO tags (name, user_id) VALUES (?, ?)',
        [name, userId],
        (err, result) => {
            if (err) {
                console.error('Error creating tag:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Tag name already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error creating tag' });
            }
            res.status(201).json({
                success: true,
                data: { id: result.insertId, name }
            });
        }
    );
};

// Get all tags
export const getAllTags = (req, res) => {
    db.query(
        'SELECT * FROM tags',
        (err, results) => {
            if (err) {
                console.error('Error fetching tags:', err);
                return res.status(500).json({ success: false, message: 'Error fetching tags' });
            }
            res.json({ success: true, data: results });
        }
    );
};

// Delete a tag
export const deleteTag = (req, res) => {
    const tagId = req.params.id;

    db.query(
        'DELETE FROM tags WHERE id = ?',
        [tagId],
        (err, result) => {
            if (err) {
                console.error('Error deleting tag:', err);
                return res.status(500).json({ success: false, message: 'Error deleting tag' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Tag not found' });
            }
            res.json({ success: true, message: 'Tag deleted successfully' });
        }
    );
};

// Add tags to a contact
export const addTagsToContact = (req, res) => {
    try {
        const contactId = req.params.id;
        const { tagIds } = req.body;

        if (!Array.isArray(tagIds) || tagIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tag IDs array is required' 
            });
        }

        // Verify contact exists
        db.query(
            'SELECT id FROM contacts WHERE id = ? AND is_active = TRUE',
            [contactId],
            (err, contacts) => {
                if (err) {
                    console.error('Error verifying contact:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error adding tags to contact' 
                    });
                }

                if (contacts.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Contact not found' 
                    });
                }

                // Create values for bulk insert
                const values = tagIds.map(tagId => [contactId, tagId]);
                
                db.query(
                    'INSERT IGNORE INTO contact_tags (contact_id, tag_id) VALUES ?',
                    [values],
                    (err) => {
                        if (err) {
                            console.error('Error adding tags to contact:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error adding tags to contact' 
                            });
                        }
                        res.json({ 
                            success: true, 
                            message: 'Tags added to contact successfully' 
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error in addTagsToContact:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding tags to contact' 
        });
    }
};

// Remove a tag from a contact
export const removeTagFromContact = (req, res) => {
    const { id: contactId, tagId } = req.params;

    db.query(
        'DELETE FROM contact_tags WHERE contact_id = ? AND tag_id = ?',
        [contactId, tagId],
        (err, result) => {
            if (err) {
                console.error('Error removing tag from contact:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error removing tag from contact' 
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Tag not found on this contact' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Tag removed from contact successfully' 
            });
        }
    );
};

// Get all tags for a contact
export const getContactTags = (req, res) => {
    const contactId = req.params.id;

    db.query(
        `SELECT t.* 
        FROM tags t
        INNER JOIN contact_tags ct ON t.id = ct.tag_id
        WHERE ct.contact_id = ?`,
        [contactId],
        (err, tags) => {
            if (err) {
                console.error('Error fetching contact tags:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching contact tags' 
                });
            }
            res.json({ success: true, data: tags });
        }
    );
};

// Add tags to a group
export const addTagsToGroup = (req, res) => {
    try {
        const groupId = req.params.id;
        const { tagIds } = req.body;

        if (!Array.isArray(tagIds) || tagIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tag IDs array is required' 
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
                        message: 'Error adding tags to group' 
                    });
                }

                if (groups.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Group not found' 
                    });
                }

                // Create values for bulk insert
                const values = tagIds.map(tagId => [groupId, tagId]);
                
                db.query(
                    'INSERT IGNORE INTO group_tags (group_id, tag_id) VALUES ?',
                    [values],
                    (err) => {
                        if (err) {
                            console.error('Error adding tags to group:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error adding tags to group' 
                            });
                        }
                        res.json({ 
                            success: true, 
                            message: 'Tags added to group successfully' 
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error in addTagsToGroup:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding tags to group' 
        });
    }
};

// Remove a tag from a group
export const removeTagFromGroup = (req, res) => {
    const { id: groupId, tagId } = req.params;

    db.query(
        'DELETE FROM group_tags WHERE group_id = ? AND tag_id = ?',
        [groupId, tagId],
        (err, result) => {
            if (err) {
                console.error('Error removing tag from group:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error removing tag from group' 
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Tag not found on this group' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Tag removed from group successfully' 
            });
        }
    );
};

// Get all tags for a group
export const getGroupTags = (req, res) => {
    const groupId = req.params.id;

    db.query(
        `SELECT t.* 
        FROM tags t
        INNER JOIN group_tags gt ON t.id = gt.tag_id
        WHERE gt.group_id = ?`,
        [groupId],
        (err, tags) => {
            if (err) {
                console.error('Error fetching group tags:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching group tags' 
                });
            }
            res.json({ success: true, data: tags });
        }
    );
}; 