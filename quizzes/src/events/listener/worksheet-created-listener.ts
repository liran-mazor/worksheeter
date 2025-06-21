import { Message } from 'node-nats-streaming';
import { Listener, WorksheetCreatedEvent, Subjects, DatabaseConnectionError } from '@liranmazor/ticketing-common';
import { Worksheet } from '../../models/worksheet';

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    
    const worksheet = Worksheet.build({
      id: data.id,
      title: data.title,
      userId: data.userId,
      keywords: data.keywords,
      status: data.status,
      version: data.version
    });

    await worksheet.save();

    msg.ack();
  }
}