import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@liranmazor/ticketing-common';
import { Quiz } from '../models/quiz';

const router = express.Router();

router.get(
  '/api/quizzes/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      throw new NotFoundError();
    }

    if (quiz.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(quiz);
  }
);

export { router as showQuizRouter };