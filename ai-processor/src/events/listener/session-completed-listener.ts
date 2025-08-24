import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SessionCompletedEvent } from '@liranmazor/common';
import { SessionSummarizedPublisher } from '../publisher/session-summarized-publisher';
import { natsClient } from '../../lib/nats-client';
import { sessionService } from '../../services/session.service';

export class SessionCompletedListener extends Listener<SessionCompletedEvent> {
  subject: Subjects.SessionCompleted = Subjects.SessionCompleted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;

  // Track sessions currently being processed
  private static processingSessions = new Set<string>();

  async onMessage(data: SessionCompletedEvent['data'], msg: Message) {
    console.log('📨 Received SessionCompletedEvent:', JSON.stringify(data, null, 2));
    
    // Check if this session is already being processed
    if (SessionCompletedListener.processingSessions.has(data.id)) {
      console.log(`⏭️ Session ${data.id} already processing, skipping duplicate event`);
      msg.ack();
      return;
    }

    // Mark session as being processed
    SessionCompletedListener.processingSessions.add(data.id);
    
    try {
      if (!data.recordingUrl) {
        throw new Error(`No recording URL available for session ${data.id}`);
      }

      console.log(`🎥 Starting AI processing for session ${data.id} with recording: ${data.recordingUrl}`);

      // Process the Daily.co recording
      const result = await sessionService.processVideoSession({
        id: data.id,
        title: data.title,
        userId: data.userId,
        recordingUrl: data.recordingUrl,
        duration: data.duration,
      });

      // Publish SessionSummarized event with results
      await new SessionSummarizedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        title: data.title,
        transcript: result.transcript,
        summary: result.summary,
        duration: data.duration,
        keyTopics: result.keyTopics,
        status: 'completed',
        processedAt: new Date().toISOString(),
      });

      console.log(`✅ Successfully processed session ${data.id} and published SessionSummarized event`);
      
    } catch (error) {
      console.error(`❌ Failed to process session ${data.id}:`, error);
      
      // Publish failed event
      await new SessionSummarizedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        title: data.title,
        transcript: '',
        summary: 'Failed to process session recording',
        duration: data.duration,
        keyTopics: [],
        status: 'failed',
        processedAt: new Date().toISOString(),
      });
    } finally {
      // Always remove from processing set when done
      SessionCompletedListener.processingSessions.delete(data.id);
    }
    
    msg.ack();
  }
}