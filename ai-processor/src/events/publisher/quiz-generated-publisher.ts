import { Publisher, Subjects, QuizGeneratedEvent } from "@liranmazor/ticketing-common";

export class QuizGeneratedPublisher extends Publisher<QuizGeneratedEvent> {
  subject: Subjects.QuizGenerated = Subjects.QuizGenerated;
}
