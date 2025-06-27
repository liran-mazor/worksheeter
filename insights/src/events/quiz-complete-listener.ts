import { Listener, QuizCompleteEvent, Subjects } from "@liranmazor/common";
import { Message } from "node-nats-streaming";

export class QuizCompleteListener extends Listener<QuizCompleteEvent> {
  subject: Subjects.QuizComplete = Subjects.QuizComplete;
  queueGroupName = 'insights-service';
  
  async onMessage(data: QuizCompleteEvent['data'], msg: Message) {
    console.log('Received QuizCompleteEvent:', JSON.stringify(data, null, 2));
    msg.ack();
  }
}