import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js'; 

// Import routes
import userRoutes from './routes/userRoutes.js';
import userManagement from './routes/admin/userManagement.js';
import contactRoutes from './routes/contactRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import scheduledMessageRoutes from './routes/scheduledMessageRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use('/api', userRoutes);
app.use('/api', userManagement);
app.use('/api', contactRoutes);
app.use('/api', groupRoutes);
app.use('/api', templateRoutes);
app.use('/api', messageRoutes);
app.use('/api', smsRoutes);
app.use('/api', scheduledMessageRoutes);
app.use('/api', tagRoutes);
app.use('/webhook', webhookRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running ...');
});

// Server listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
