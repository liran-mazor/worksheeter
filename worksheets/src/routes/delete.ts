import express, { Request, Response } from 'express';
import { natsWrapper } from '../nats-wrapper';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@liranmazor/ticketing-common';
import { Worksheet } from '../models/worksheet';
import { WorksheetDeletedPublisher } from '../events/publisher/worksheet-deleted-publisher';

const router = express.Router();

router.delete(
  '/api/worksheets/:worksheetId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { worksheetId } = req.params;

    const worksheet = await Worksheet.findById(worksheetId)

    if (!worksheet) {
      throw new NotFoundError();
    }
    if (worksheet.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    
    await Worksheet.findByIdAndDelete(worksheetId);

    await new WorksheetDeletedPublisher(natsWrapper.client).publish({
      id: worksheet.id,
      userId: worksheet.userId,
    });

    res.status(204).send(worksheet);
  }
);

export { router as deleteWorksheetRouter };