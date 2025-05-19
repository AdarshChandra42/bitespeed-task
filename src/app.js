import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
//import rateLimit from 'express-rate-limit';
import identifyRoute from './routes/identifyRoute.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/', identifyRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  res.status(statusCode).json({ error: message });
});

export default app;
