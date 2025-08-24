import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@liranmazor/common';
import { Session } from '../models/session';
import axios from 'axios';
import { DailyRoomResponse } from '../types/types';

const router = express.Router();

const createDailyRoom = async (sessionTitle: string) => {
  const response = await axios.post<DailyRoomResponse>('https://api.daily.co/v1/rooms', {
    name: `session-${Date.now()}`,
    properties: {
      max_participants: 10,
      enable_recording: 'cloud',
      enable_screenshare: true,
      enable_chat: true,
      start_video_off: false,
      start_audio_off: false,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
    },
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DAILY_API_KEY}`,
    },
  });

  return {
    roomUrl: response.data.url,
    roomName: response.data.name,
  };
};

router.post(
  '/api/sessions/new',
  requireAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('mentor')
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage('Mentor name must be less than 30 characters'),
    body('class')
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage('Class name must be less than 10 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, mentor, class: className } = req.body;

    // Create Daily.co room
    const { roomUrl, roomName } = await createDailyRoom(title);

    // Create session record with new Daily.co fields
    const session = Session.build({
      title,
      userId: req.currentUser!.id,
      mentor,
      class: className,
      roomUrl,
      roomName,
      status: 'live',
      summary: '',
    });

    await session.save();

    res.status(201).json({
      id: session.id,
      title: session.title,
      roomUrl: session.roomUrl,
      roomName: session.roomName,
      mentor: session.mentor,
      class: session.class,
      status: session.status,
      createdAt: session.createdAt,
    });
  }
);

export { router as newSessionRouter };