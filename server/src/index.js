import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import interviewRoutes from './routes/interviews.js';
import projectRoutes from './routes/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/projects', projectRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
