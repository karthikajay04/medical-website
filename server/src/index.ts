import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import doctorsRouter from './routes/doctors.js';
import bookingsRouter from './routes/bookings.js';
import queueRouter from './routes/queue.js';
import settingsRouter from './routes/settings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting API Routes
app.use('/api/auth', authRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/settings', settingsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root check
app.get('/', (req, res) => {
  res.send('Aethera Clinic API Server is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Aethera Clinic Server is live on http://localhost:${PORT}`);
});
