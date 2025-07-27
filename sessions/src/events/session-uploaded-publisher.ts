import { Publisher, Subjects, SessionUploadedEvent } from "@liranmazor/common";

export class SessionUploadedPublisher extends Publisher<SessionUploadedEvent> {
  subject: Subjects.SessionUploaded = Subjects.SessionUploaded;
}