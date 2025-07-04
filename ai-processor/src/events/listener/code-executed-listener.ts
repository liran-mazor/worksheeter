import { Message } from 'node-nats-streaming';
import { CodeExecutedEvent, Listener, Subjects } from '@liranmazor/common';
import { natsClient } from '../../lib/nats-client';
import { claudeClient } from '../../lib/claude-client';
import { CodeAnalyzedPublisher } from '../publisher/code-analyzed-publisher';

export class CodeExecutedListener extends Listener<CodeExecutedEvent> {
  subject: Subjects.CodeExecuted = Subjects.CodeExecuted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: CodeExecutedEvent['data'], msg: Message) {
    msg.ack();
    
    try {
      // Generate analysis using Claude
      const analysis = await claudeClient.generateCodeAnalysis(
        data.problemDescription,
        data.userCode,
        data.language,
        data.judge0Response.testResults,
        data.judge0Response.overallStatus
      );
      
      // Publish the analyzed result
      await new CodeAnalyzedPublisher(natsClient.client).publish({
        id: data.id,
        userId: data.userId,
        problemId: data.problemId,
        userFeedback: analysis.feedback,
        analytics: analysis.analytics,
        analyzedAt: new Date().toISOString().split('T')[0],
        status: 'completed',
      });
      
    } catch (error) {
      console.error('Failed to generate code analysis:', error);
      return;
    }
  }   
};

