import db from '../config/db.js';

// Create a new template
export const createTemplate = (req, res) => {
    const { name, content } = req.body;
    const userId = req.user.id; // Get user ID from decoded token

    if (!name || !content) {
        return res.status(400).json({ success: false, message: 'Template name and content are required' });
    }

    console.log('Creating template with user_id:', userId);

    db.query(
        'INSERT INTO templates (name, content, user_id) VALUES (?, ?, ?)',
        [name, content, userId],
        (err, result) => {
            if (err) {
                console.error('Error creating template:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Template name already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error creating template' });
            }
            res.status(201).json({
                success: true,
                data: { id: result.insertId, name, content, user_id: userId }
            });
        }
    );
};

// Get all templates
export const getAllTemplates = (req, res) => {
    const userId = req.user.id; // Get user ID from decoded token
    
    console.log('Fetching templates for user_id:', userId);
    
    // Modified query to get both user's templates and templates with NULL user_id
    db.query(
        'SELECT * FROM templates WHERE user_id = ? OR user_id IS NULL ORDER BY name ASC',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching templates:', err);
                return res.status(500).json({ success: false, message: 'Error fetching templates' });
            }
            console.log('Found templates:', results.length);
            res.json({ success: true, data: results });
        }
    );
};

// Get a template by ID
export const getTemplateById = (req, res) => {
    const templateId = req.params.id;
    const userId = req.user.id; // Get user ID from decoded token
    
    db.query(
        'SELECT * FROM templates WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
        [templateId, userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching template:', err);
                return res.status(500).json({ success: false, message: 'Error fetching template' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }
            
            res.json({ success: true, data: results[0] });
        }
    );
};

// Update a template
export const updateTemplate = (req, res) => {
    const templateId = req.params.id;
    const { name, content } = req.body;
    const userId = req.user.id; // Get user ID from decoded token
    
    if (!name || !content) {
        return res.status(400).json({ success: false, message: 'Template name and content are required' });
    }
    
    db.query(
        'UPDATE templates SET name = ?, content = ?, user_id = ? WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
        [name, content, userId, templateId, userId],
        (err, result) => {
            if (err) {
                console.error('Error updating template:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Template name already exists' 
                    });
                }
                return res.status(500).json({ success: false, message: 'Error updating template' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }
            
            res.json({ 
                success: true, 
                message: 'Template updated successfully',
                data: { id: templateId, name, content, user_id: userId }
            });
        }
    );
};

// Delete a template
export const deleteTemplate = (req, res) => {
    const templateId = req.params.id;
    const userId = req.user.id; // Get user ID from decoded token
    
    db.query(
        'DELETE FROM templates WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
        [templateId, userId],
        (err, result) => {
            if (err) {
                console.error('Error deleting template:', err);
                return res.status(500).json({ success: false, message: 'Error deleting template' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }
            
            res.json({ success: true, message: 'Template deleted successfully' });
        }
    );
}; 