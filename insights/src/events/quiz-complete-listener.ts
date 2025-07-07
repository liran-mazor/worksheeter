import { Listener, QuizCompleteEvent, Subjects } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { quizService } from "../services/quiz.service";
import { vectorService } from "../services/vector.service";

export class QuizCompleteListener extends Listener<QuizCompleteEvent> {
  subject: Subjects.QuizComplete = Subjects.QuizComplete;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: QuizCompleteEvent['data'], msg: Message) {
    try {
      await quizService.processQuizCompleteEvent(data);

      await vectorService.storeQuizCompletionEvent(data);
    } catch (error) {
      console.error(`Error processing quiz complete event:`, error);
      return;
    }
    msg.ack();
  }
}