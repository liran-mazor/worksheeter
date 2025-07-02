import { Message } from 'node-nats-streaming';
import { Listener, Subjects, QuizGeneratedEvent, NotFoundError } from '@liranmazor/common';
import { QuizService } from '../../services/quiz.service';

export class QuizGeneratedListener extends Listener<QuizGeneratedEvent> {
  subject: Subjects.QuizGenerated = Subjects.QuizGenerated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: QuizGeneratedEvent['data'], msg: Message) {
    
    msg.ack();
    
    try {

      if (data.status === 'available' && data.questions.length > 0) {
        await QuizService.markAsAvailable(data.id, data.questions);
      } else if (data.status === 'failed') {
        await QuizService.markAsFailed(data.id);
      }

    } catch (error) {
      console.error('Error processing quiz generated event:', error);
      return
    }
    msg.ack();
  }
}