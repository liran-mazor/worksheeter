import { Publisher, Subjects, WorksheetDeletedEvent } from "@liranmazor/ticketing-common";

export class WorksheetDeletedPublisher extends Publisher<WorksheetDeletedEvent> {
  subject: Subjects.WorksheetDeleted = Subjects.WorksheetDeleted;
}