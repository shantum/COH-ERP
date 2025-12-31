import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import variationsRouter from './routes/variations.js';
import skusRouter from './routes/skus.js';
import fabricsRouter from './routes/fabrics.js';
import { errorHandler } from './middleware/errorHandler.js';

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
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      variations: '/api/variations',
      skus: '/api/skus',
      fabrics: '/api/fabrics',
      fabricTypes: '/api/fabrics/fabric-types',
    }
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/variations', variationsRouter);
app.use('/api/skus', skusRouter);
app.use('/api/fabrics', fabricsRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
