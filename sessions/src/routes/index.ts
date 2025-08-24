import express, { Request, Response } from 'express';
import { requireAuth } from '@liranmazor/common';
import { Session } from '../models/session';

const router = express.Router();

router.get(
  '/api/sessions',
  requireAuth,
  async (req: Request, res: Response) => {
    const sessions = await Session.find({})
      .sort({ createdAt: -1 });

    res.send(sessions);
  }
);

export { router as indexSessionsRouter };