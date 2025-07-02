import { Listener, QuizCompleteEvent, Subjects } from "@liranmazor/common";
import { Message } from "node-nats-streaming";
import { AnalyticsService } from "../services/analytics.service";
import { WorksheetPerformanceAgent } from "../agents/worksheet-performance-agent";
import { AgentContext } from "../agents/types";

export class QuizCompleteListener extends Listener<QuizCompleteEvent> {
  subject: Subjects.QuizComplete = Subjects.QuizComplete;
  queueGroupName = 'insights-service';
  
  private worksheetAgent = new WorksheetPerformanceAgent();
  
  async onMessage(data: QuizCompleteEvent['data'], msg: Message) {
    try {
      await AnalyticsService.updateQuizCompletion(
        data.worksheetId,
        data.userId,
        data.difficulty,
        data.score,
        new Date(data.completedAt)
      );

      await this.runAgents(data);
      
    } catch (error) {
      console.error('Error processing quiz complete event:', error);
      return;
    }
    msg.ack();
  }

  private async runAgents(data: QuizCompleteEvent['data']): Promise<void> {
    try {
      const context: AgentContext = {
        eventType: 'quiz-complete',
        worksheetId: data.worksheetId,
        worksheetTitle: data.worksheetTitle,
        userId: data.userId,
        difficulty: data.difficulty,
        score: data.score,
        timestamp: new Date()
      };

      await this.worksheetAgent.run(context);
      
      // Future: Add more agents here
      // await this.studentStruggleAgent.run(context);
      
    } catch (error) {
      console.error('Error running agents:', error);
    }
  }
}