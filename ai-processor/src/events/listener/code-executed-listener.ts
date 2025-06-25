import { Message } from 'node-nats-streaming';
import { CodeExecutedEvent, Listener, Subjects } from '@liranmazor/common';
import { natsClient } from '../../lib/nats-client';
import { claudeClient } from '../../lib/claude-client';
import { Judge0Response } from '../../lib/types';

export class CodeExecutedListener extends Listener<CodeExecutedEvent> {
  subject: Subjects.CodeExecuted = Subjects.CodeExecuted;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  
  async onMessage(data: CodeExecutedEvent['data'], msg: Message) {
   console.log('Code executed listener - Full data:', JSON.stringify(data, null, 2));
   
   const judge0Response = data.judge0Response as Judge0Response;
   console.log('Judge0 Response details:', JSON.stringify(judge0Response, null, 2));
   console.log('Test Results:', judge0Response.testResults);
   console.log('Overall Status:', judge0Response.overallStatus);
   console.log('Total Passed:', judge0Response.totalPassed);
   console.log('Total Failed:', judge0Response.totalFailed);
   
   msg.ack();
   
   // TODO: publish a final generated feedback of the code execution   

  }   
};

