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

    let questions = [];
    if (updatedQuiz.questions && Array.isArray(updatedQuiz.questions.questions)) {
      questions = updatedQuiz.questions.questions;
    } else if (Array.isArray(updatedQuiz.questions)) {
      questions = updatedQuiz.questions;
    }

    res.status(200).send({
      ...updatedQuiz,
      questions,
    });

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
);

export { router as completeQuizRouter };