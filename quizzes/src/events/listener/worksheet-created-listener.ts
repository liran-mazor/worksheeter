import { Message } from 'node-nats-streaming';
import { Listener, WorksheetCreatedEvent, Subjects } from '@liranmazor/common';
import { WorksheetService } from '../../services/worksheet.service';

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    try {
      await WorksheetService.create({
        id: data.id,
        title: data.title,
        userId: data.userId,
        keywords: data.keywords,
        version: data.version
      });

    } catch (error) {
      console.error('Error processing worksheet created event:', error);
    }
    msg.ack();
  }
}