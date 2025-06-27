import { Listener, CodeAnalyzedEvent, Subjects,  } from "@liranmazor/common";
import { Message } from "node-nats-streaming";

export class CodeAnalyzedListener extends Listener<CodeAnalyzedEvent> {
  subject: Subjects.CodeAnalyzed = Subjects.CodeAnalyzed;
  queueGroupName = 'insights-service';
  
  async onMessage(data: CodeAnalyzedEvent['data'], msg: Message) {
   console.log('Received CodeAnalyzedEvent:', JSON.stringify(data, null, 2));
   msg.ack();
  }
}