import express, { Request, Response } from 'express';
import { natsClient } from '../lib/nats-client';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@liranmazor/common';
import { Worksheet } from '../models/worksheet';
import { WorksheetDeletedPublisher } from '../events/publisher/worksheet-deleted-publisher';

const router = express.Router();

router.delete(
  '/api/worksheets/:worksheetId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { worksheetId } = req.params;

    const worksheet = await Worksheet.findById(worksheetId);

    if (!worksheet) {
      throw new NotFoundError();
    }
    if (worksheet.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    
    await Worksheet.findByIdAndDelete(worksheetId);

    res.status(204).send();
    
    try {
      await new WorksheetDeletedPublisher(natsClient.client).publish({
        id: worksheet.id,
        userId: worksheet.userId,
      });
    } catch (error) {
      console.error('Failed to publish worksheet deletion event:', error);
    }

  }
);
export { router as deleteWorksheetRouter };