import express from 'express';
import { verifyUserToken } from '../middleware/verifyUserToken.js';
import {
    createTag,
    getAllTags,
    deleteTag,
    addTagsToContact,
    removeTagFromContact,
    getContactTags,
    addTagsToGroup,
    removeTagFromGroup,
    getGroupTags
} from '../controllers/tagController.js';

const router = express.Router();

// Tag Management Routes
router.post('/tags', verifyUserToken, createTag);
router.get('/tags', verifyUserToken, getAllTags);
router.delete('/tags/:id', verifyUserToken, deleteTag);

// Contact Tag Management
router.post('/contacts/:id/tags', verifyUserToken, addTagsToContact);
router.delete('/contacts/:id/tags/:tagId', verifyUserToken, removeTagFromContact);
router.get('/contacts/:id/tags', verifyUserToken, getContactTags);

// Group Tag Management
router.post('/groups/:id/tags', verifyUserToken, addTagsToGroup);
router.delete('/groups/:id/tags/:tagId', verifyUserToken, removeTagFromGroup);
router.get('/groups/:id/tags', verifyUserToken, getGroupTags);

export default router; 