import { Message } from 'node-nats-streaming';
import { Listener, Subjects, QuizGeneratedEvent, NotFoundError } from '@liranmazor/ticketing-common';
import { Quiz } from '../../models/quiz';

export class QuizGeneratedListener extends Listener<QuizGeneratedEvent> {
  subject: Subjects.QuizGenerated = Subjects.QuizGenerated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: QuizGeneratedEvent['data'], msg: Message) {
    
    const quiz = await Quiz.findById(data.id);
    
    if (!quiz) {
      throw new NotFoundError();
    }

    if (data.status === 'available' && data.questions.length > 0) {
      await quiz.markAsAvailable(data.questions);
      
    } else if (data.status === 'failed') {
      await quiz.markAsFailed();
    }

    msg.ack();
      
  }
}