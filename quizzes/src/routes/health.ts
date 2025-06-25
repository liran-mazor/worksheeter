import express from 'express';

const router = express.Router();

router.get('/api/quizzes/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'quizzes',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };