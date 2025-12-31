import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'COH ERP API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'COH Internal ERP API',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
