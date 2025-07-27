import express from 'express';

const router = express.Router();

router.get('/api/sessions/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'sessions',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };