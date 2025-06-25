import { Publisher, Subjects, WorksheetGeneratedEvent } from "@liranmazor/common";

export class WorksheetGeneratedPublisher extends Publisher<WorksheetGeneratedEvent> {
  subject: Subjects.WorksheetGenerated = Subjects.WorksheetGenerated;
}
