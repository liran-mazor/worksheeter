import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { natsClient } from '../lib/nats-client';
import { requireAuth, validateRequest, BadRequestError } from '@liranmazor/common';
import { Worksheet } from '../models/worksheet';
import { WorksheetCreatedPublisher } from '../events/publisher/worksheet-created-publisher';

const router = express.Router();

router.post(
  '/api/worksheets',
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
    const { title, keywords, questions } = req.body;

    const existingWorksheet = await Worksheet.findOne({ 
      userId: req.currentUser!.id,
      title: title.trim()
    });

    if (existingWorksheet) {
      throw new BadRequestError('Worksheet title must be unique');
    }

    const worksheet = Worksheet.build({
      title: title.trim(),
      userId: req.currentUser!.id,
      keywords,
      questions 
    });
    
    await worksheet.save();

    res.status(201).send(worksheet);
   
    try {
      await new WorksheetCreatedPublisher(natsClient.client).publish({
        id: worksheet.id,
      title: worksheet.title,
      userId: worksheet.userId,
      keywords: worksheet.keywords,
      questions: worksheet.questions,
      status: worksheet.status,
      version: worksheet.version
      });
    } catch (error) {
      console.error('Failed to publish worksheet creation event:', error);
    }
  }
);

export { router as newWorksheetRouter };