import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import {
    createGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    addContactsToGroup,
    removeContactFromGroup,
    getGroupContacts,
    sendSMSToGroup
} from '../controllers/groupController.js';

const router = express.Router();

// Group Management Routes
router.post('/groups', verifyUserToken, createGroup);
router.get('/groups', verifyUserToken, getAllGroups);
router.get('/groups/:id', verifyUserToken, getGroup);
router.put('/groups/:id', verifyUserToken, updateGroup);
router.delete('/groups/:id', verifyUserToken, deleteGroup);

// Group Members Management
router.post('/groups/:id/contacts', verifyUserToken, addContactsToGroup);
router.delete('/groups/:id/contacts/:contactId', verifyUserToken, removeContactFromGroup);
router.get('/groups/:id/contacts', verifyUserToken, getGroupContacts);

// Send SMS to a group
router.post('/groups/:id/send', verifyUserToken, sendSMSToGroup);

export default router; 