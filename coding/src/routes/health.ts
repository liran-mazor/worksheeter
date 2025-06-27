import express from 'express';

const router = express.Router();

router.get('/api/coding/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    service: 'coding',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };