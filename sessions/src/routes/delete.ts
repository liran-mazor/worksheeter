import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@liranmazor/common';
import { Session } from '../models/session';

const router = express.Router();

router.delete(
  '/api/sessions/:sessionId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      throw new NotFoundError();
    }
    // if (session.userId !== req.currentUser!.id) {
    //   throw new NotAuthorizedError();
    // }
    
    await Session.findByIdAndDelete(sessionId);

    res.status(204).send();
    
  }
);
export { router as deleteSessionRouter };