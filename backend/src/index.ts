import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
