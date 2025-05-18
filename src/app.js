import express from 'express';
import identifyRoute from './routes/identifyRoute.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', identifyRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
