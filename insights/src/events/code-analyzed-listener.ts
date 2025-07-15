import { Listener, CodeAnalyzedEvent, Subjects } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { vectorService } from "../services/vector.service";

export class CodeAnalyzedListener extends Listener<CodeAnalyzedEvent> {
  subject: Subjects.CodeAnalyzed = Subjects.CodeAnalyzed;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: CodeAnalyzedEvent['data'], msg: Message) {
    try {

      const strugglingAreas = data.analytics.strugglingAreas.map(area => ({
        category: area.category.toString(),
        intensity: area.intensity.toString(),
        description: area.evidence
      }));

      await vectorService.storeCodeAnalysis({
        userId: data.userId,
        problemId: data.problemId,
        strugglingAreas: strugglingAreas,
        metrics: data.analytics.metrics,
        context: data.analytics.context,
        analyzedAt: data.analyzedAt
      });
    } catch (error) {
      console.error('❌ Error processing code analyzed event:', error);
      return;
    }
    msg.ack();
  }
}