import { Message } from 'node-nats-streaming';
import { Subjects, Listener, WorksheetCreatedEvent } from '@liranmazor/common';
import { WorksheetGeneratedPublisher } from '../publisher/worksheet-generated-publisher';
import { natsClient } from '../../lib/nats-client';
import { worksheetService } from '../../services/worksheet.service';

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    msg.ack();
    try {
      const [keywordDefinitions, questionAnswers] = await Promise.all([
        worksheetService.generateKeywordDefinitions(data.keywords, data.title),
        worksheetService.generateQuestionAnswers(data.questions, data.keywords, data.title)
      ]);

      await new WorksheetGeneratedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        keywordDefinitions: keywordDefinitions,
        questionAnswers: questionAnswers,
        status: 'completed'
      });
    } catch (error) {
      console.error('Worksheet generation failed:', error);
    }
  }
}