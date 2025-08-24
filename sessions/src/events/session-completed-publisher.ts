import { Publisher, Subjects, SessionCompletedEvent } from "@liranmazor/common";

export class SessionCompletedPublisher extends Publisher<SessionCompletedEvent> {
  subject: Subjects.SessionCompleted = Subjects.SessionCompleted;
}