import { Publisher, Subjects, QuizGeneratedEvent } from "@liranmazor/common";

export class QuizGeneratedPublisher extends Publisher<QuizGeneratedEvent> {
  subject: Subjects.QuizGenerated = Subjects.QuizGenerated;
}
