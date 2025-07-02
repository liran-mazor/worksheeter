import { Listener, WorksheetGeneratedEvent, Subjects, NotFoundError } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { Worksheet } from "../../models/worksheet";

export class WorksheetGeneratedListener extends Listener<WorksheetGeneratedEvent> {
  subject: Subjects.WorksheetGenerated = Subjects.WorksheetGenerated;
  queueGroupName = 'worksheets-service';
  
  async onMessage(data: WorksheetGeneratedEvent['data'], msg: Message) {
    try {
      const worksheet = await Worksheet.findByIdOrThrow(data.id);
      
      worksheet.status = data.status;
      
      if (data.status === 'completed') {
        if (data.keywordDefinitions) {
          worksheet.keywordDefinitions = data.keywordDefinitions;
        }
        if (data.questionAnswers) {
          worksheet.questionAnswers = data.questionAnswers;
        }
      }
      
      await worksheet.save();
      
    } catch (error) {
      console.error('Error processing worksheet generated event:', error);
      return
    }

    msg.ack();
  }
}