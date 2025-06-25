import { Message } from 'node-nats-streaming';
import { Listener, QuizCreatedEvent, Subjects } from '@liranmazor/common';
import { QuizGeneratedPublisher } from '../publisher/quiz-generated-publisher';
import { natsClient } from '../../lib/nats-client';
import { claudeClient } from '../../lib/claude-client';

export class QuizCreatedListener extends Listener<QuizCreatedEvent> {
  subject: Subjects.QuizCreated = Subjects.QuizCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: QuizCreatedEvent['data'], msg: Message) {

    msg.ack();
    
    try {
      const questions = await claudeClient.generateQuizQuestions(
        data.keywords,
        data.title,
        data.difficulty
      );

      await new QuizGeneratedPublisher(natsClient.client).publish({
        id: data.id,
        questions: questions,
        status: 'available'
      });
      
    } catch (error) {
      console.error('Quiz generation failed:', error);
      
      // Publish failure status
      try {
        await new QuizGeneratedPublisher(natsClient.client).publish({
          id: data.id,
          questions: [],
          status: 'failed'
        });
      } catch (publishError) {
        console.error('Failed to publish quiz failure status:', publishError);
      }
    }
  }
}