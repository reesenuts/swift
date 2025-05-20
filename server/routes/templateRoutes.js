import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import { createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate } from '../controllers/templateController.js';

const router = express.Router();

// Message Template Routes
router.post('/templates', verifyUserToken, createTemplate);
router.get('/templates', verifyUserToken, getAllTemplates);
router.get('/templates/:id', verifyUserToken, getTemplateById);
router.put('/templates/:id', verifyUserToken, updateTemplate);
router.delete('/templates/:id', verifyUserToken, deleteTemplate);

export default router; 