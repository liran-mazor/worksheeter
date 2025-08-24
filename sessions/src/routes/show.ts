import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@liranmazor/common';
import { Session } from '../models/session';

const router = express.Router();

router.get(
  '/api/sessions/:sessionId',
  requireAuth,
  async (req: Request, res: Response) => {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      throw new NotFoundError();
    }

    res.send(session);
  }
);

export { router as showSessionRouter };