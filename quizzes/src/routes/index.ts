import express, { Request, Response } from 'express';
import { requireAuth } from '@liranmazor/common';
import { QuizService } from '../services/quiz.service';

const router = express.Router();

router.get(
  '/api/quizzes',
  requireAuth,
  async (req: Request, res: Response) => {
    const dashboardData = await QuizService.getDashboardData(req.currentUser!.id);
    res.send(dashboardData);
  }
);

export { router as indexQuizzesRouter };