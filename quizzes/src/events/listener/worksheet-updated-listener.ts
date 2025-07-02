import { Message } from 'node-nats-streaming';
import { Listener, WorksheetUpdatedEvent, Subjects, NotFoundError } from '@liranmazor/common';
import { WorksheetService } from '../../services/worksheet.service';

export class WorksheetUpdatedListener extends Listener<WorksheetUpdatedEvent> {
  subject: Subjects.WorksheetUpdated = Subjects.WorksheetUpdated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetUpdatedEvent['data'], msg: Message) {
    try {
      await WorksheetService.update(data.id, {
        title: data.title,
        keywords: data.keywords,
        version: data.version
      });
    } catch (error) {
      console.error('Error processing worksheet updated event:', error);
      return
    }
    msg.ack();
  }
}