import express, { Request, Response } from 'express';
import { requireAuth } from '@liranmazor/ticketing-common';
import { Worksheet } from '../models/worksheet';

const router = express.Router();

router.get(
  '/api/worksheets',
  requireAuth,
  async (req: Request, res: Response) => {
    const worksheets = await Worksheet.find({
    userId: req.currentUser!.id,
  })
  .sort({ createdAt: -1 });

  res.send(worksheets);
});

export { router as indexWorksheetsRouter };