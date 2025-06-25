import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@liranmazor/common';
import { natsClient } from '../lib/nats-client';
import { Worksheet } from '../models/worksheet';
import { WorksheetUpdatedPublisher } from '../events/publisher/worksheet-updated-publisher';

const router = express.Router();

router.put(
  '/api/worksheets/:worksheetId',
  requireAuth,
  [
    body('title')
      .trim()                          
      .notEmpty()
      .withMessage('Title must be provided'),
    body('keywords')
      .isArray({ min: 1, max: 30 })   
      .withMessage('Keywords must be provided as an array (1-30 items)'),
    body('keywords.*')
      .trim()                         
      .isString()
      .notEmpty()
      .withMessage('Each keyword must be a non-empty string'),
    body('questions')
      .isArray({ min: 1, max: 30 })   
      .withMessage('Questions must be provided as an array (1-30 items)'),
    body('questions.*')
      .trim()                         
      .isString()
      .notEmpty()
      .withMessage('Each question must be a non-empty string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const worksheet = await Worksheet.findById(req.params.worksheetId);

    if (!worksheet) {
      throw new NotFoundError();
    }

    if (worksheet.userId !== req.currentUser!.id){
      throw new NotAuthorizedError();
    }

    worksheet.set({
      title: req.body.title,
      keywords: req.body.keywords,
      questions: req.body.questions,
    });
    await worksheet.save();
    
    try {
      await new WorksheetUpdatedPublisher(natsClient.client).publish({
        id: worksheet.id,
        title: worksheet.title,
        userId: worksheet.userId,
        keywords: worksheet.keywords,
        questions: worksheet.questions,
        status: worksheet.status,
        version: worksheet.version
      });
    } catch (error) {
      console.error('Failed to publish worksheet update event:', error);
    }

    res.send(worksheet); 
  }
);

export { router as updateWorksheetRouter };