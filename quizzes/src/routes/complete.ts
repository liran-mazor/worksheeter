import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@liranmazor/ticketing-common';
import { Quiz } from '../models/quiz';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/quizzes/:id/complete',
  requireAuth,
  [
    body('score')
      .isInt({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { score } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      throw new NotFoundError();
    }

    if (quiz.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (quiz.status !== 'available') {
      throw new NotFoundError();
    }

    await quiz.complete(score);

    // await new QuizCompletedPublisher(natsWrapper.client).publish({
    //   id: quiz.id,
    //   worksheetId: quiz.worksheetId,
    //   userId: quiz.userId,
    //   difficulty: quiz.difficulty,
    //   score: score,
    //   completedAt: quiz.completedAt!.toISOString(),
    //   version: quiz.version
    // });

    res.send(quiz);
  }
);

export { router as completeQuizRouter };