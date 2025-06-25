import { Publisher, Subjects, QuizCompleteEvent } from "@liranmazor/common";

export class QuizCompletePublisher extends Publisher<QuizCompleteEvent> {
  subject: Subjects.QuizComplete = Subjects.QuizComplete;
   
}