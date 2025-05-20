import db from '../config/db.js';

// Get all contacts
export const getAllContacts = (req, res) => {
    db.query(
        'SELECT * FROM contacts WHERE is_active = TRUE',
        (err, contacts) => {
            if (err) {
                console.error('Error fetching contacts:', err);
                return res.status(500).json({ success: false, message: 'Error fetching contacts' });
            }
            res.json({ success: true, data: contacts });
        }
    );
};

// Create a new contact
export const createContact = (req, res) => {
    const { first_name, last_name, phone_number, email } = req.body;

    if (!phone_number) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    db.query(
        'INSERT INTO contacts (first_name, last_name, phone_number, email) VALUES (?, ?, ?, ?)',
        [first_name || null, last_name || null, phone_number, email || null],
        (err, result) => {
            if (err) {
                console.error('Error creating contact:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Phone number already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error creating contact' });
            }
            res.status(201).json({
                success: true,
                data: { 
                    id: result.insertId, 
                    first_name, 
                    last_name, 
                    phone_number, 
                    email 
                }
            });
        }
    );
};

// Get a single contact
export const getContact = (req, res) => {
    const contactId = req.params.id;

    db.query(
        'SELECT * FROM contacts WHERE id = ? AND is_active = TRUE',
        [contactId],
        (err, contacts) => {
            if (err) {
                console.error('Error fetching contact:', err);
                return res.status(500).json({ success: false, message: 'Error fetching contact' });
            }
            if (contacts.length === 0) {
                return res.status(404).json({ success: false, message: 'Contact not found' });
            }
            res.json({ success: true, data: contacts[0] });
        }
    );
};

// Update a contact
export const updateContact = (req, res) => {
    const contactId = req.params.id;
    const { first_name, last_name, phone_number, email } = req.body;

    db.query(
        'UPDATE contacts SET first_name = ?, last_name = ?, phone_number = ?, email = ? WHERE id = ? AND is_active = TRUE',
        [first_name, last_name, phone_number, email, contactId],
        (err, result) => {
            if (err) {
                console.error('Error updating contact:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Phone number already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error updating contact' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Contact not found' });
            }
            res.json({ success: true, message: 'Contact updated successfully' });
        }
    );
};

// Delete a contact (soft delete)
export const deleteContact = (req, res) => {
    const contactId = req.params.id;

    db.query(
        'UPDATE contacts SET is_active = FALSE WHERE id = ?',
        [contactId],
        (err, result) => {
            if (err) {
                console.error('Error deleting contact:', err);
                return res.status(500).json({ success: false, message: 'Error deleting contact' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Contact not found' });
            }
            res.json({ success: true, message: 'Contact deleted successfully' });
        }
    );
}; 