import express from 'express';

const router = express.Router();

router.get('/api/code-executor/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'code-executor',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };