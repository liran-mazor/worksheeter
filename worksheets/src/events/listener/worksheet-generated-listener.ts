import { Listener, WorksheetGeneratedEvent, Subjects, NotFoundError } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { Worksheet } from "../../models/worksheet";

export class WorksheetGeneratedListener extends Listener<WorksheetGeneratedEvent> {
  subject: Subjects.WorksheetGenerated = Subjects.WorksheetGenerated;
  queueGroupName = 'worksheets-service';
  
  async onMessage(data: WorksheetGeneratedEvent['data'], msg: Message) {
    
    msg.ack();
    
    try {
      const worksheet = await Worksheet.findById(data.id);
      
      if (!worksheet) {
        console.error(`Worksheet not found: ${data.id}`);
        return; 
      }
      
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
    }
  }
}