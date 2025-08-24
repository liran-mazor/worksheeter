import express, { Request, Response } from 'express';
import { requireAuth } from '@liranmazor/common';
import { Session } from '../models/session';
import { SessionCompletedPublisher } from '../events/session-completed-publisher';
import { natsClient } from '../lib/nats-client';

const router = express.Router();

router.post(
  '/api/sessions/:sessionId/end',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const session = await Session.findById(req.params.sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Only session creator can end the session
      if (session.userId !== req.currentUser!.id) {
        return res.status(403).json({ error: 'Not authorized to end this session' });
      }

      // Can only end live sessions
      if (session.status !== 'live') {
        return res.status(400).json({ error: 'Session is not live' });
      }

      // Update session status
      session.status = 'completed';
      session.recordingUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';
      session.duration = 1;
      
      await session.save();

      await new SessionCompletedPublisher(natsClient.client).publish({
        id: session.id,
        title: session.title,
        userId: session.userId,
        mentor: session.mentor!,
        class: session.class!,
        roomUrl: session.roomUrl!,
        roomName: session.roomName!,
        recordingUrl: session.recordingUrl!,
        duration: session.duration,
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      console.log(`✅ Session manually ended: ${session.id}, AI processing triggered`);

      res.json({
        id: session.id,
        title: session.title,
        status: session.status,
        recordingUrl: session.recordingUrl,
        duration: session.duration,
      });

    } catch (error) {
      console.error('Error ending session:', error);
      res.status(500).json({ error: 'Failed to end session' });
    }
  }
);

export { router as endSessionRouter };