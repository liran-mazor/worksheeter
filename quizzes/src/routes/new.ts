import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@liranmazor/common';
import { natsClient } from '../lib/nats-client';
import { QuizCreatedPublisher } from '../events/publisher/quiz-created-publisher';
import { WorksheetService } from '../services/worksheet.service';
import { QuizService } from '../services/quiz.service';
import { Difficulty } from '../types/quiz';

const router = express.Router();

router.post(
  '/api/quizzes',
  requireAuth,
  [
    body('worksheetId')
      .notEmpty()
      .withMessage('Valid worksheetId is required'),
    body('difficulty')
      .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
      .withMessage('Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { worksheetId, difficulty } = req.body;

    const worksheet = await WorksheetService.findById(worksheetId);

    if (!worksheet || worksheet.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    const existingQuiz = await QuizService.findByWorksheetAndDifficulty(
      worksheetId,
      req.currentUser!.id,
      difficulty as Difficulty
    );

    if (existingQuiz) {
      res.status(200).send(existingQuiz);
      return;
    }

    const quiz = await QuizService.create({
      worksheetId,
      userId: req.currentUser!.id,
      title: worksheet.title,
      difficulty: difficulty as Difficulty
    });

    const difficultyString = quiz.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';

    try {
      await new QuizCreatedPublisher(natsClient.client).publish({
        id: quiz.id,
        worksheetId: quiz.worksheetId,
        userId: quiz.userId,
        title: quiz.title,
        keywords: worksheet.keywords,
        difficulty: difficultyString,
        status: 'processing' as const, 
        version: quiz.version
      });
    } catch (error) {
      console.error('Failed to publish quiz creation event:', error);
    }

    res.status(201).send(quiz);
  }
);

export { router as newQuizRouter };