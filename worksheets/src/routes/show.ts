import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@liranmazor/common';
import { Worksheet } from '../models/worksheet';

const router = express.Router();

router.get(
  '/api/worksheets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const worksheet = await Worksheet.findOne({ 
      _id: req.params.id, 
      userId: req.currentUser!.id 
    });

    if (!worksheet) {
      throw new NotFoundError();
    }
    if (worksheet.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(worksheet);
  }
);

export { router as showWorksheetRouter };