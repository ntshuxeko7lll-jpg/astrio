import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import { initializeDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Initialize DB and start server
async function start() {
  try {
    await initializeDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
