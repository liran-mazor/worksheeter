import { PROBLEMS, PROBLEM_CATEGORIES } from "../lib/problems-data";
import { NotFoundError, requireAuth } from "@liranmazor/common";
import express, { Request, Response, Router } from 'express';

const router = express.Router();

router.get('/api/coding/categories',
  requireAuth, (req: Request, res: Response) => {
   res.send(PROBLEM_CATEGORIES);
 });
 
router.get('/api/coding/problems',
  requireAuth, (req: Request, res: Response) => {
   res.send(Object.values(PROBLEMS));
});

 router.get('/api/coding/problem/:problemId',
  requireAuth, (req: Request, res: Response) => {
   const { problemId } = req.params;
   const problem = PROBLEMS[problemId];
   if (!problem) {
     throw new NotFoundError();
   }
   res.send(problem);
 });

 router.get('/api/coding/problems/:category',
  requireAuth, (req: Request, res: Response) => {
    const { category } = req.params;
    if (category === 'all') {
      res.send(Object.values(PROBLEMS));
      return;
    }
    const categoryProblems = Object.values(PROBLEMS)
      .filter(p => p.category === category);
    res.send(categoryProblems);
});

export { router as problemsRouter };