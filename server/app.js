import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js'; 

// Import routes
import userRoutes from './routes/userRoutes.js';
import userManagement  from './routes/admin/userManagemet.js';

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

// Default route
app.get('/', (req, res) => {
    res.send('API is running ...');
});

// Server listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
