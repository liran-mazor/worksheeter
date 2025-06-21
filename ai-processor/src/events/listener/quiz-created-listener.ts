import { Message } from 'node-nats-streaming';
import { Listener, QuizCreatedEvent, Subjects } from '@liranmazor/ticketing-common';
import { QuizGeneratedPublisher } from '../publisher/quiz-generated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { ClaudeClient } from '../../claude-client';

export class QuizCreatedListener extends Listener<QuizCreatedEvent> {
  subject: Subjects.QuizCreated = Subjects.QuizCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: QuizCreatedEvent['data'], msg: Message) {
    
    msg.ack();
  
    const claudeClient = new ClaudeClient();
    
    const questions = await claudeClient.generateQuizQuestions(
      data.keywords,
      data.title,
      data.difficulty
    );

    await new QuizGeneratedPublisher(natsWrapper.client).publish({
      id: data.id,
      questions: questions,
      status: 'available'
    });
  }
}