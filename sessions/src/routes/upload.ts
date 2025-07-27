import express, { Request, Response } from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@liranmazor/common';
import { Session } from '../models/session';
import { SessionUploadedPublisher } from '../events/session-uploaded-publisher';
import { natsClient } from '../lib/nats-client';

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit - 50 minutes of audio approx
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post(
  '/api/sessions/upload',
  requireAuth,
  upload.single('audio'),
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // For now, we'll store the audio file info - later you can save to cloud storage
    const audioFileName = `session_${Date.now()}_${req.file.originalname}`;

    // Create session record
    const session = Session.build({
      title,
      userId: req.currentUser!.id,
      audioFile: audioFileName,
      summary: '', // Will be filled after AI processing
      duration: duration ? parseInt(duration) : undefined,
      status: 'processing',
    });

    await session.save();

    // Publish event for AI processing
    await new SessionUploadedPublisher(natsClient.client).publish({
      id: session.id,
      title: session.title,
      userId: session.userId,
      audioFile: session.audioFile!,
      duration: session.duration,
      status: 'processing',
      uploadedAt: session.createdAt.toISOString(),
    });

    res.status(201).json({
      id: session.id,
      title: session.title,
      status: session.status,
      createdAt: session.createdAt,
    });
  }
);

export { router as uploadSessionRouter }; 