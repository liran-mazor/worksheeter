import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CodeExecutedEvent } from '@liranmazor/common';
import { CodeAnalyzedPublisher } from '../publisher/code-analyzed-publisher';
import { natsClient } from '../../lib/nats-client';
import { codeService } from '../../services/code.service';

export class CodeExecutedListener extends Listener<CodeExecutedEvent> {
  subject: Subjects.CodeExecuted = Subjects.CodeExecuted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: CodeExecutedEvent['data'], msg: Message) {
    msg.ack();
    try {
      const analysis = await codeService.generateCodeAnalysis(
        data.problemDescription,
        data.userCode,
        data.language,
        data.judge0Response.testResults,
        data.judge0Response.overallStatus
      );
      
      await new CodeAnalyzedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        problemId: data.problemId,
        userFeedback: analysis.feedback,
        analytics: analysis.analytics,
        analyzedAt: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
    } catch (error) {
      console.error('Code analysis failed:', error);
    }
  }   
};

