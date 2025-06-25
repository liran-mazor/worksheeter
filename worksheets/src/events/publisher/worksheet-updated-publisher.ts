import { Publisher, Subjects, WorksheetUpdatedEvent } from "@liranmazor/common";

export class WorksheetUpdatedPublisher extends Publisher<WorksheetUpdatedEvent> {
  subject: Subjects.WorksheetUpdated = Subjects.WorksheetUpdated;
}