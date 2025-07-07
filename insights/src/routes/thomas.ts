import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@liranmazor/common';
import { ragService } from '../services/rag.services';
import { body } from 'express-validator';
import { validateRequest } from '@liranmazor/common';

const router = express.Router();
router.post(
  '/api/insights/thomas/chat',
  requireAuth,
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { message } = req.body;
    const userId = req.currentUser!.id;

    try {
      const response = await ragService.generateAnswer(message, userId);
      
      res.status(200).json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Thomas chat error:', error);
    }
  }
);

export { router as thomasRouter };