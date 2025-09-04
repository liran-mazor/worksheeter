import express, { Request, Response } from 'express';
import { BadRequestError } from '@liranmazor/common';
import { Session } from '../models/session';
import { SessionCompletedPublisher } from '../events/session-completed-publisher';
import { natsClient } from '../lib/nats-client';
import axios from 'axios';

const router = express.Router();

// Track processed recordings to prevent duplicates
const processedRecordings = new Set<string>();

router.post(
  '/api/sessions/webhook',
  async (req: Request, res: Response) => {
    const { type, payload } = req.body;
    
    console.log('Daily.co webhook received:', { type, payload });

    if (type === 'recording.ready-to-download') {
      const { room_name, recording_id, duration } = payload;
      
      // Check if already processed
      if (processedRecordings.has(recording_id)) {
        console.log(`⏭️ Recording ${recording_id} already processed, skipping`);
        return res.status(200).json({ received: true, skipped: true });
      }

      // Mark as processing
      processedRecordings.add(recording_id);

      try {
        // Find session by room name
        const session = await Session.findOne({ roomName: room_name });
        
        if (!session) {
          console.log(`Session not found for room: ${room_name}`);
          processedRecordings.delete(recording_id);
          throw new Error('Session not found');
        }

        // Check if session already completed
        if (session.status === 'completed') {
          console.log(`Session ${session.id} already completed, skipping`);
          return res.status(200).json({ received: true, alreadyCompleted: true });
        }

        console.log(`🔍 Fetching recording details for: ${recording_id}`);
        
        // Fetch recording details from Daily.co API
        const response = await axios.get(`https://api.daily.co/v1/recordings/${recording_id}`, {
          headers: {
            'Authorization': `Bearer 103b4ef51a20dec79aedce7df7af8311e52622f33d562e4642c73e5d2ca69e1d`
          }
        });

        console.log('📥 Daily.co API response received');
        console.log('📥 Daily.co API full response:', JSON.stringify(response.data, null, 2));

        // Daily.co uses share_token, not download_link
        const shareToken = (response.data as any).share_token;
        
        if (!shareToken) {
          throw new BadRequestError('No share token available from Daily.co');
        }

        // Construct recording URL using share token
        const recordingUrl = `https://worksheeter.daily.co/rec/${shareToken}`;
        
        // Update session with recording info
        session.recordingUrl = recordingUrl;
        session.duration = duration ? Math.ceil(duration / 60) : Math.ceil(duration);
        session.status = 'completed';
        
        await session.save();

        // Publish SessionCompleted event for AI processing
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

        console.log(`✅ Session completed: ${session.id}, recording ready for AI processing`);
        console.log(`📎 Recording URL: ${recordingUrl}`);

        res.status(200).json({ 
          success: true, 
          sessionId: session.id,
          recordingUrl: recordingUrl 
        });

      } catch (error) {
        // Clean up on error
        processedRecordings.delete(recording_id);
        throw error; // Let error middleware handle it
      }

    } else if (type === 'room.ended') {
      const { room_name } = payload;
      
      const session = await Session.findOne({ roomName: room_name });
      if (session && session.status === 'live') {
        session.status = 'completed';
        await session.save();
        console.log(`📝 Session marked as completed: ${session.id} (waiting for recording)`);
      }
      
      res.status(200).json({ received: true, type: 'room.ended' });

    } else {
      console.log(`🤷 Unknown webhook type: ${type}`);
      res.status(200).json({ received: true, type: 'unknown' });
    }
  }
);

export { router as sessionWebhookRouter };