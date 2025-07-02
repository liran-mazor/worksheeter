import express, { Request, Response } from 'express';
import { requireAuth, NotAuthorizedError } from '@liranmazor/common';
import { QuizService } from '../services/quiz.service';

const router = express.Router();

router.get(
  '/api/quizzes/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const quiz = await QuizService.findById(req.params.id);

    if (quiz.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Normalize questions for frontend
    let questions = [];
    if (quiz.questions && Array.isArray(quiz.questions.questions)) {
      questions = quiz.questions.questions;
    } else if (Array.isArray(quiz.questions)) {
      questions = quiz.questions;
    }

    res.send({
      ...quiz,
      questions,
    });
  }
);

export { router as showQuizRouter };