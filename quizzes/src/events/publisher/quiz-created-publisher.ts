import { Publisher, Subjects, QuizCreatedEvent } from "@liranmazor/ticketing-common";

export class QuizCreatedPublisher extends Publisher<QuizCreatedEvent> {
  subject: Subjects.QuizCreated = Subjects.QuizCreated;
}
