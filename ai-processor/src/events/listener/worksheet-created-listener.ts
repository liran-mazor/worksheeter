import { Message } from 'node-nats-streaming';
import { ClaudeClient } from '../../claude-client';
import { WorksheetGeneratedPublisher } from '../publisher/worksheet-generated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { Listener, WorksheetCreatedEvent, Subjects } from '@liranmazor/ticketing-common';

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    
    msg.ack();
    
    const claudeClient = new ClaudeClient();
    
    const [keywordDefinitions, questionAnswers] = await Promise.all([
      claudeClient.generateKeywordDefinitions(data.keywords, data.title),
      claudeClient.generateQuestionAnswers(data.questions, data.keywords, data.title)
    ]);

    await new WorksheetGeneratedPublisher(natsWrapper.client).publish({
      id: data.id,
      userId: data.userId,
      keywordDefinitions,
      questionAnswers,
      status: 'completed'
    });
  }
}