import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@liranmazor/ticketing-common';
import { Quiz } from '../models/quiz';
import { Worksheet } from '../models/worksheet';
import { natsWrapper } from '../nats-wrapper';
import { QuizCreatedPublisher } from '../events/publisher/quiz-created-publisher';

const router = express.Router();

router.post(
  '/api/quizzes',
  requireAuth,
  [
    body('worksheetId')
      .notEmpty()
      .isMongoId()
      .withMessage('Valid worksheetId is required'),
    body('difficulty')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { worksheetId, difficulty } = req.body;

    const worksheet = await Worksheet.findOne({
      _id: worksheetId,
      userId: req.currentUser!.id
    });

    if (!worksheet) {
      throw new NotFoundError();
    }

    const existingQuiz = await Quiz.findOne({
      worksheetId,
      userId: req.currentUser!.id,
      difficulty
    });

    if (existingQuiz) {
      res.status(200).send(existingQuiz);
      return;
    }

    const quiz = Quiz.build({
      worksheetId,
      userId: req.currentUser!.id,
      title: worksheet.title,
      keywords: worksheet.keywords,
      difficulty
    });

    await quiz.save();

    await new QuizCreatedPublisher(natsWrapper.client).publish({
      id: quiz.id,
      worksheetId: quiz.worksheetId,
      userId: quiz.userId,
      title: quiz.title,
      keywords: quiz.keywords,
      difficulty: quiz.difficulty,
      status: 'processing' as const, 
      version: quiz.version
    });

    res.status(201).send(quiz);
  }
);

export { router as newQuizRouter };