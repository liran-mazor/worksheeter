import { Publisher, Subjects, WorksheetCreatedEvent } from "@liranmazor/ticketing-common";

export class WorksheetCreatedPublisher extends Publisher<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
}