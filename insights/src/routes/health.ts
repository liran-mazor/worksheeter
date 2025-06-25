import express from 'express';

const router = express.Router();

router.get('/api/insights/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'insights',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };