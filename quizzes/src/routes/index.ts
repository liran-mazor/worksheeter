import express, { Request, Response } from 'express';
import { requireAuth } from '@liranmazor/ticketing-common';
import { Worksheet } from '../models/worksheet';
import { Quiz } from '../models/quiz';

const router = express.Router();

router.get(
  '/api/quizzes',
  requireAuth,
  async (req: Request, res: Response) => {
    const worksheets = await Worksheet.find({
      userId: req.currentUser!.id,
    }).sort({ createdAt: -1 });

    const dashboardData = await Promise.all(
      worksheets.map(async (worksheet) => {
        const beginnerQuiz = await Quiz.findOne({
          worksheetId: worksheet.id,
          userId: req.currentUser!.id,
          difficulty: 'beginner'
        }).sort({ createdAt: -1 });

        const intermediateQuiz = await Quiz.findOne({
          worksheetId: worksheet.id,
          userId: req.currentUser!.id,
          difficulty: 'intermediate'
        }).sort({ createdAt: -1 });

        const advancedQuiz = await Quiz.findOne({
          worksheetId: worksheet.id,
          userId: req.currentUser!.id,
          difficulty: 'advanced'
        }).sort({ createdAt: -1 });

        const getQuizStatus = (quiz: any, isLocked: boolean) => {
          if (isLocked) {
            return { status: 'locked' };
          }
          
          if (!quiz) {
            return { status: 'available' };
          }
          
          if (quiz.score !== undefined && quiz.completedAt) {
            return { 
              status: 'completed', 
              score: quiz.score, 
              quizId: quiz.id,
              completedAt: quiz.completedAt
            };
          }
          
          if (quiz.status === 'processing') {
            return { status: 'processing', quizId: quiz.id };
          }
          
          if (quiz.status === 'failed') {
            return { status: 'failed', quizId: quiz.id };
          }
          
          if (quiz.status === 'available') {
            return { status: 'available', quizId: quiz.id };
          }
          
          return { status: 'available', quizId: quiz.id };
        };

        const beginnerCompleted = beginnerQuiz?.score === 100;
        const intermediateCompleted = intermediateQuiz?.score === 100;

        return {
          worksheetId: worksheet.id,
          worksheetTitle: worksheet.title,
          createdAt: worksheet.createdAt,
          keywordsCount: worksheet.keywords.length,
          quizProgress: {
            beginner: getQuizStatus(beginnerQuiz, false), 
            intermediate: getQuizStatus(intermediateQuiz, !beginnerCompleted),
            advanced: getQuizStatus(advancedQuiz, !intermediateCompleted)
          }
        };
      })
    );

    res.send(dashboardData);
  }
);

export { router as indexQuizzesRouter };