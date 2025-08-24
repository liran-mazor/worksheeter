import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SessionSummarizedEvent } from '@liranmazor/common';
import { Session } from '../models/session';

export class SessionSummarizedListener extends Listener<SessionSummarizedEvent> {
  subject: Subjects.SessionSummarized = Subjects.SessionSummarized;
  queueGroupName = 'sessions-service';

  async onMessage(data: SessionSummarizedEvent['data'], msg: Message) {
    console.log('📨 Received SessionSummarizedEvent:', JSON.stringify(data, null, 2));
    
    try {
      const session = await Session.findById(data.id);
      
      if (!session) {
        console.log(`Session not found: ${data.id}`);
        msg.ack();
        return;
      }

      // Update session with AI processing results
      if (data.status === 'completed') {
        session.transcript = data.transcript;
        session.summary = data.summary;
        session.keyTopics = data.keyTopics;  
        session.duration = data.duration || session.duration; 
        session.status = 'completed';
        
        console.log(`✅ Session ${data.id} updated with AI analysis results`);
      } else {
        session.status = 'failed';
        session.summary = data.summary || 'AI processing failed';
        
        console.log(`❌ Session ${data.id} marked as failed`);
      }

      await session.save();
      
    } catch (error) {
      console.error(`Error updating session ${data.id}:`, error);
    }
    
    msg.ack();
  }
}