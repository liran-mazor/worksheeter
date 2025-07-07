import { Message } from 'node-nats-streaming';
import { Subjects, Listener, QuizCreatedEvent } from '@liranmazor/common';
import { QuizGeneratedPublisher } from '../publisher/quiz-generated-publisher';
import { natsClient } from '../../lib/nats-client';
import { quizService } from '../../services/quiz.service';

export class QuizCreatedListener extends Listener<QuizCreatedEvent> {
  subject: Subjects.QuizCreated = Subjects.QuizCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;

  async onMessage(data: QuizCreatedEvent['data'], msg: Message) {
    msg.ack();
    try {
      const questions = await quizService.generateQuizQuestions(
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
    }
  }
}