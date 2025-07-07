import { Listener, CodeAnalyzedEvent, Subjects } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { vectorService } from "../services/vector.service";

export class CodeAnalyzedListener extends Listener<CodeAnalyzedEvent> {
  subject: Subjects.CodeAnalyzed = Subjects.CodeAnalyzed;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: CodeAnalyzedEvent['data'], msg: Message) {
    try {
      await vectorService.storeCodeAnalysisEvent(data);
    } catch (error) {
      console.error(`Error processing code analyzed event:`, error);
      return;
    }
    msg.ack();
  }
}