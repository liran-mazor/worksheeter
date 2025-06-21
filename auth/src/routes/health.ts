import express from 'express';

const router = express.Router();

router.get('/api/auth/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'auth',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };