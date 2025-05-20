# Tagging System

This document describes the tagging system for contacts and groups in the Swift SMS application.

## Database Schema

### Tables

- `tags`: Stores all available tags
- `contact_tags`: Junction table connecting contacts to tags
- `group_tags`: Junction table connecting groups to tags

### Relationships

- A contact can have multiple tags (many-to-many)
- A group can have multiple tags (many-to-many)
- Tags can be shared between contacts and groups

## API Endpoints

### Tag Management

- `POST /api/tags`: Create a new tag
  - Request body: `{ "name": "tag name" }`
  - Response: `{ "success": true, "data": { "id": 1, "name": "tag name" } }`

- `GET /api/tags`: Get all tags
  - Response: `{ "success": true, "data": [ { "id": 1, "name": "tag name" }, ... ] }`

- `DELETE /api/tags/:id`: Delete a tag
  - Response: `{ "success": true, "message": "Tag deleted successfully" }`

### Contact Tag Management

- `POST /api/contacts/:id/tags`: Add tags to a contact
  - Request body: `{ "tagIds": [1, 2, 3] }`
  - Response: `{ "success": true, "message": "Tags added to contact successfully" }`

- `DELETE /api/contacts/:id/tags/:tagId`: Remove a tag from a contact
  - Response: `{ "success": true, "message": "Tag removed from contact successfully" }`

- `GET /api/contacts/:id/tags`: Get all tags for a contact
  - Response: `{ "success": true, "data": [ { "id": 1, "name": "tag name" }, ... ] }`

### Group Tag Management

- `POST /api/groups/:id/tags`: Add tags to a group
  - Request body: `{ "tagIds": [1, 2, 3] }`
  - Response: `{ "success": true, "message": "Tags added to group successfully" }`

- `DELETE /api/groups/:id/tags/:tagId`: Remove a tag from a group
  - Response: `{ "success": true, "message": "Tag removed from group successfully" }`

- `GET /api/groups/:id/tags`: Get all tags for a group
  - Response: `{ "success": true, "data": [ { "id": 1, "name": "tag name" }, ... ] }`

## Frontend Usage

You can use the API service to manage tags from the frontend:

```javascript
// Create a new tag
await api.tags.create("High Priority");

// Add tags to a contact
await api.tags.addToContact(contactId, [tagId1, tagId2]);

// Get all tags for a contact
const contactTags = await api.tags.getContactTags(contactId);

// Add tags to a group
await api.tags.addToGroup(groupId, [tagId1, tagId3]);

// Get all tags for a group
const groupTags = await api.tags.getGroupTags(groupId);
```

## Implementation Notes

1. To apply the database schema changes, run the SQL script in `server/database/tag_schema_update.sql`
2. Tags can be filtered and searched in the UI for organizing contacts and groups
3. Both contacts and groups share the same tag pool for consistency and easier management 