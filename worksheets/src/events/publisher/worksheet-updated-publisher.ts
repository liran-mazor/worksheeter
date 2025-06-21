import { Publisher, Subjects, WorksheetUpdatedEvent } from "@liranmazor/ticketing-common";

export class WorksheetUpdatedPublisher extends Publisher<WorksheetUpdatedEvent> {
  subject: Subjects.WorksheetUpdated = Subjects.WorksheetUpdated;
}