import { Listener, Subjects, WorksheetCreatedEvent } from "@liranmazor/common";
import { natsClient } from "../../lib/nats-client";
import { WorksheetGeneratedPublisher } from "../publisher/worksheet-generated-publisher";
import { claudeClient } from "../../lib/claude-client";
import { Message } from "node-nats-streaming";

export class WorksheetCreatedListener extends Listener<WorksheetCreatedEvent> {
  subject: Subjects.WorksheetCreated = Subjects.WorksheetCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: WorksheetCreatedEvent['data'], msg: Message) {

    msg.ack();
    
    try {
      
      const [keywordDefinitions, questionAnswers] = await Promise.all([
        claudeClient.generateKeywordDefinitions(data.keywords, data.title),
        claudeClient.generateQuestionAnswers(data.questions, data.keywords, data.title)
      ]);

      await new WorksheetGeneratedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        keywordDefinitions,
        questionAnswers,
        status: 'completed'
      });
      
    } catch (error) {
      console.error('Worksheet processing failed:', error);
      try {
        await new WorksheetGeneratedPublisher(natsClient.client).publish({
          id: data.id,
          userId: data.userId,
          keywordDefinitions: [],
          questionAnswers: [],
          status: 'failed'
        });
      } catch (publishError) {
        console.error('Failed to publish failure status:', publishError);
      }
    }
  }
}