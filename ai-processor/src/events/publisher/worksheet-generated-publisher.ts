import { Publisher, Subjects, WorksheetGeneratedEvent } from "@liranmazor/ticketing-common";

export class WorksheetGeneratedPublisher extends Publisher<WorksheetGeneratedEvent> {
  subject: Subjects.WorksheetGenerated = Subjects.WorksheetGenerated;
}
