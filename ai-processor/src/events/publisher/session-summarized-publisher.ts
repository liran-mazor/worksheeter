import { Publisher, Subjects, SessionSummarizedEvent } from "@liranmazor/common";

export class SessionSummarizedPublisher extends Publisher<SessionSummarizedEvent> {
  subject: Subjects.SessionSummarized = Subjects.SessionSummarized;
}