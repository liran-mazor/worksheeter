import { Listener, Subjects, WorksheetCreatedEvent } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { vectorService } from "../services/vector.service";

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {
    try {
      await vectorService.storeWorksheetCreationEvent({
        id: data.id,
        title: data.title,
        userId: data.userId,
        createdAt: new Date()
      });

    } catch (error) {
      console.error('❌ Error processing worksheet created event:', error);
      return;
    }
    msg.ack();
  }
}