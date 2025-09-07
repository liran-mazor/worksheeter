import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@liranmazor/common';
import { QuizService } from '../services/quiz.service';
import { QuizCompletePublisher } from '../events/publisher/quiz-complete-publisher';
import { natsClient } from '../lib/nats-client';

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

    const updatedQuiz = await QuizService.complete(quizId, score, req.currentUser!.id);

    const normalizedQuiz = QuizService.normalizeQuizForFrontend(updatedQuiz);
    res.status(200).send(normalizedQuiz);

    if (process.env.NODE_ENV !== 'test') {
      try {
        await new QuizCompletePublisher(natsClient.client).publish({
          quizId: updatedQuiz.id,
          worksheetId: updatedQuiz.worksheetId,
          worksheetTitle: updatedQuiz.title, 
          userId: updatedQuiz.userId,
          score: updatedQuiz.score || 0,
          difficulty: updatedQuiz.difficulty,
          completedAt: updatedQuiz.completedAt || new Date(),
          version: updatedQuiz.version || 0
        });
      } catch (error) {
        console.error('Failed to publish quiz completion event:', error);
      }
    }

  }
);

export { router as completeQuizRouter };