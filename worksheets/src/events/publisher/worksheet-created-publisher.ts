import { Publisher, Subjects, WorksheetCreatedEvent } from "@liranmazor/common";

export class WorksheetCreatedPublisher extends Publisher<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
}