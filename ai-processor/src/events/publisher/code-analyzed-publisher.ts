import { Publisher, Subjects, CodeAnalyzedEvent } from "@liranmazor/common";

export class CodeAnalyzedPublisher extends Publisher<CodeAnalyzedEvent> {
  subject: Subjects.CodeAnalyzed = Subjects.CodeAnalyzed;
}
