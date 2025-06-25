import { Message } from 'node-nats-streaming';
import { Listener, WorksheetDeletedEvent, Subjects, NotFoundError } from '@liranmazor/common';
import { WorksheetService } from '../../services/worksheet.service';
import { QuizService } from '../../services/quiz.service';
import { prisma } from '../../lib/prisma-client';

export class WorksheetDeletedListener extends Listener<WorksheetDeletedEvent> {
  subject: Subjects.WorksheetDeleted = Subjects.WorksheetDeleted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetDeletedEvent['data'], msg: Message) {
    
    msg.ack();

    try {
      // Find the worksheet to verify ownership
      const worksheet = await WorksheetService.findById(data.id);
      
      if (!worksheet || worksheet.userId !== data.userId) {
        throw new NotFoundError();
      }
      
      // Delete all quizzes associated with this worksheet
      const quizzes = await QuizService.getWorksheetQuizzes(data.id, data.userId);
      for (const quiz of quizzes) {
        await (prisma as any).quiz.delete({
          where: { id: quiz.id }
        });
      }
      
      // Delete the worksheet
      await WorksheetService.delete(data.id);
      
    } catch (error) {
      console.error('Error processing worksheet deleted event:', error);
      msg.ack(); 
    }
  }
}