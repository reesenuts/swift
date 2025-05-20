import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
} from '../controllers/contactController.js';

const router = express.Router();

// Contact Management Routes
router.post('/contacts', verifyUserToken, createContact);
router.get('/contacts', verifyUserToken, getAllContacts);
router.get('/contacts/:id', verifyUserToken, getContact);
router.put('/contacts/:id', verifyUserToken, updateContact);
router.delete('/contacts/:id', verifyUserToken, deleteContact);

export default router; 