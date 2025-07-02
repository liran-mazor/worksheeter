import { Listener, Subjects, WorksheetCreatedEvent } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { AnalyticsService } from "../services/analytics.service";

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = 'insights-service';
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    try {
      await AnalyticsService.createInitialQuizRecords(
        data.id,  
        data.title,
        data.userId
      );
    } catch (error) {
      console.error('Error processing worksheet created event:', error);
      return;
    }

    msg.ack();
  }
}