import { Publisher, Subjects, CodeExecutedEvent } from "@liranmazor/common";

export class CodeExecutedPublisher extends Publisher<CodeExecutedEvent> {
  subject: Subjects.CodeExecuted = Subjects.CodeExecuted;
}