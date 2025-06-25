import express from 'express';

const router = express.Router();

router.get('/api/worksheets/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'worksheets',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };