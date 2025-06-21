import { Message } from 'node-nats-streaming';
import { Listener, WorksheetDeletedEvent, Subjects, DatabaseConnectionError, NotFoundError } from '@liranmazor/ticketing-common';
import { Worksheet } from '../../models/worksheet';
import { Quiz } from '../../models/quiz';

export class WorksheetDeletedListener extends Listener<WorksheetDeletedEvent> {
  subject: Subjects.WorksheetDeleted = Subjects.WorksheetDeleted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetDeletedEvent['data'], msg: Message) {

    const worksheet = await Worksheet.findById(data.id);
      
    if (!worksheet || worksheet.userId !== data.userId) {
      throw new NotFoundError();
    }
    
    await Quiz.deleteMany({ 
      worksheetId: data.id,
      userId: data.userId 
    });
    
    await Worksheet.findByIdAndDelete(data.id);
    
    msg.ack(); 
  }
}