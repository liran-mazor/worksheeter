import { Message } from 'node-nats-streaming';
import { Listener, WorksheetUpdatedEvent, Subjects, DatabaseConnectionError, NotFoundError } from '@liranmazor/ticketing-common';
import { Worksheet } from '../../models/worksheet';

export class WorksheetUpdatedListener extends Listener<WorksheetUpdatedEvent> {
  subject: Subjects.WorksheetUpdated = Subjects.WorksheetUpdated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetUpdatedEvent['data'], msg: Message) {

    const worksheet = await Worksheet.findOne({
        _id: data.id,
        version: data.version - 1
      });

    if (!worksheet || worksheet.userId !== data.userId) {
      throw new NotFoundError();
    }
    
    worksheet.set({
      title: data.title,
      keywords: data.keywords,
      status: data.status,
      version: data.version
    });

    await worksheet.save();

    msg.ack();
  }
}