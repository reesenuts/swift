# API Testing Guide for Swift SMS Application

This document provides testing instructions for all API endpoints in the Swift SMS application.

## Authentication

Most endpoints require a valid JWT token for authentication. To obtain a token:

```http
POST /api/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

Use the returned token in the Authorization header for subsequent requests:
```
Authorization: Bearer your-token
```

## 1. SMS Endpoints

### Send Single SMS
```http
POST /api/sms/send
Content-Type: application/json
Authorization: Bearer your-token

{
  "phoneNumber": "09XXXXXXXXX",
  "message": "Test message"
}
```

### Send Bulk SMS
```http
POST /api/sms/bulk
Content-Type: application/json
Authorization: Bearer your-token

{
  "phoneNumbers": ["09XXXXXXXXX", "09XXXXXXXXX"],
  "message": "Bulk test message"
}
```

### Get SMS Status
```http
GET /api/sms/status/MESSAGE_ID
Authorization: Bearer your-token
```

### Get Balance
```http
GET /api/sms/balance
Authorization: Bearer your-token
```

## 2. Message Management

### Get All Messages
```http
GET /api/messages
Authorization: Bearer your-token
```

### Get Message by ID
```http
GET /api/messages/1
Authorization: Bearer your-token
```

### Delete Message
```http
DELETE /api/messages/1
Authorization: Bearer your-token
```

### Get Message Status
```http
GET /api/messages/1/status
Authorization: Bearer your-token
```

### Get Delivery Statistics
```http
GET /api/messages/analytics/delivery-stats
Authorization: Bearer your-token
```

### Get Failure Rates
```http
GET /api/messages/analytics/failure-rates
Authorization: Bearer your-token
```

## 3. Scheduled Messages

### Schedule a Message
```http
POST /api/schedule
Content-Type: application/json
Authorization: Bearer your-token

{
  "message": "Scheduled test message",
  "scheduled_time": "2023-12-31T23:59:59",
  "recipient_type": "single",
  "recipient_id": 1
}
```

### Schedule a Group Message
```http
POST /api/schedule
Content-Type: application/json
Authorization: Bearer your-token

{
  "message": "Group scheduled message",
  "scheduled_time": "2023-12-31T23:59:59",
  "recipient_type": "group",
  "recipient_id": 1
}
```

### Get All Scheduled Messages
```http
GET /api/schedule
Authorization: Bearer your-token
```

### Get Scheduled Message by ID
```http
GET /api/schedule/1
Authorization: Bearer your-token
```

### Update Scheduled Message
```http
PUT /api/schedule/1
Content-Type: application/json
Authorization: Bearer your-token

{
  "message": "Updated message",
  "scheduled_time": "2024-01-01T12:00:00"
}
```

### Delete Scheduled Message
```http
DELETE /api/schedule/1
Authorization: Bearer your-token
```

### Process Due Messages Manually
```http
POST /api/schedule/process
Authorization: Bearer your-token
```

## 4. Contacts

### Create Contact
```http
POST /api/contacts
Content-Type: application/json
Authorization: Bearer your-token

{
  "phone_number": "09XXXXXXXXX",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Get All Contacts
```http
GET /api/contacts
Authorization: Bearer your-token
```

### Get Contact by ID
```http
GET /api/contacts/1
Authorization: Bearer your-token
```

### Update Contact
```http
PUT /api/contacts/1
Content-Type: application/json
Authorization: Bearer your-token

{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### Delete Contact
```http
DELETE /api/contacts/1
Authorization: Bearer your-token
```

## 5. Groups

### Create Group
```http
POST /api/groups
Content-Type: application/json
Authorization: Bearer your-token

{
  "name": "Important Clients",
  "description": "VIP clients list"
}
```

### Get All Groups
```http
GET /api/groups
Authorization: Bearer your-token
```

### Get Group by ID
```http
GET /api/groups/1
Authorization: Bearer your-token
```

### Update Group
```http
PUT /api/groups/1
Content-Type: application/json
Authorization: Bearer your-token

{
  "name": "VIP Clients",
  "description": "Very important clients"
}
```

### Delete Group
```http
DELETE /api/groups/1
Authorization: Bearer your-token
```

### Add Contact to Group
```http
POST /api/groups/1/contacts
Content-Type: application/json
Authorization: Bearer your-token

{
  "contact_id": 1
}
```

### Remove Contact from Group
```http
DELETE /api/groups/1/contacts/1
Authorization: Bearer your-token
```

## 6. Templates

### Create Template
```http
POST /api/templates
Content-Type: application/json
Authorization: Bearer your-token

{
  "name": "Welcome Message",
  "content": "Welcome to our service, {{name}}!"
}
```

### Get All Templates
```http
GET /api/templates
Authorization: Bearer your-token
```

### Get Template by ID
```http
GET /api/templates/1
Authorization: Bearer your-token
```

### Update Template
```http
PUT /api/templates/1
Content-Type: application/json
Authorization: Bearer your-token

{
  "name": "Updated Welcome",
  "content": "Thank you for joining our service, {{name}}!"
}
```

### Delete Template
```http
DELETE /api/templates/1
Authorization: Bearer your-token
```

## 7. Webhook Testing

To test Vonage webhook delivery receipts, you'll need to simulate a webhook call from Vonage. You can use Postman to send a POST request to your webhook endpoint:

```http
POST /webhook/vonage/delivery-receipt
Content-Type: application/json

{
  "messageId": "your-message-id",
  "status": "delivered",
  "err-code": "0",
  "price": "0.0250",
  "network": "Example Network"
}
```

## Notes

1. Replace `your-token` with your actual JWT token
2. Replace IDs (like `/contacts/1`) with actual IDs from your database
3. Replace `09XXXXXXXXX` with actual Philippine mobile numbers
4. The scheduled_time must be in ISO format (YYYY-MM-DDTHH:MM:SS) and in the future
5. Webhook testing requires your server to be accessible from the internet (use ngrok for local testing) 