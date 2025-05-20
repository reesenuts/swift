# Message Scheduling and Queuing System

This system allows you to schedule SMS messages to be sent at a future date and time, either to individual contacts or to groups.

## Setup

1. Create the `scheduled_messages` table in your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_text TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    recipient_type ENUM('single', 'group') NOT NULL,
    recipient_id INT NOT NULL,
    status ENUM('pending', 'queued', 'sent', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_status (status)
);
```

2. Start the scheduler process (in a separate terminal):

```bash
node scripts/scheduler.js
```

This will check for scheduled messages every minute and process any that are due.

## API Endpoints

### Schedule a Message

```http
POST /api/schedule
Authorization: Bearer your_token
Content-Type: application/json

{
    "message": "Your scheduled message text",
    "scheduled_time": "2023-06-15T10:00:00",
    "recipient_type": "single",
    "recipient_id": 1
}
```

- `message`: The text message to send
- `scheduled_time`: ISO format date and time for when the message should be sent
- `recipient_type`: Either "single" (for one contact) or "group" (for a group of contacts)
- `recipient_id`: The ID of the contact or group

### Get All Scheduled Messages

```http
GET /api/schedule
Authorization: Bearer your_token
```

Optional query parameters:
- `status`: Filter by status (pending, queued, sent, failed)
- `fromDate`: Filter by scheduled time from (ISO format)
- `toDate`: Filter by scheduled time to (ISO format)

### Get a Specific Scheduled Message

```http
GET /api/schedule/{id}
Authorization: Bearer your_token
```

### Update a Scheduled Message

```http
PUT /api/schedule/{id}
Authorization: Bearer your_token
Content-Type: application/json

{
    "message": "Updated message text",
    "scheduled_time": "2023-06-16T15:30:00",
    "recipient_type": "group",
    "recipient_id": 2
}
```

All fields are optional - only include what you want to update.

### Delete a Scheduled Message

```http
DELETE /api/schedule/{id}
Authorization: Bearer your_token
```

### Manually Process Scheduled Messages

```http
POST /api/schedule/process
Authorization: Bearer your_token
```

This will force processing of any scheduled messages that are due.

## Status Values

- `pending`: Message is scheduled but not yet sent
- `queued`: Message is being processed for sending
- `sent`: Message has been sent successfully
- `failed`: Message failed to send

## Notes

- Messages can only be scheduled for a future time
- For group messages, all active contacts in the group will receive the message
- Messages are checked for sending every minute by the scheduler process
- Maximum message length is 3200 characters (Vonage limit) 