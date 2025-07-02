import { Listener, CodeAnalyzedEvent, Subjects,  } from "@liranmazor/common";
import { Message } from "node-nats-streaming";

export class CodeAnalyzedListener extends Listener<CodeAnalyzedEvent> {
  subject: Subjects.CodeAnalyzed = Subjects.CodeAnalyzed;
  queueGroupName = 'insights-service';
  
  async onMessage(data: CodeAnalyzedEvent['data'], msg: Message) {
   console.log('Received CodeAnalyzedEvent:', JSON.stringify(data, null, 2));
   msg.ack();
  }
}

//TODO: Vector database for code:analyzed event

/*
export interface CodeAnalyzedEvent extends Event {
  subject: Subjects.CodeAnalyzed;
  data: {
    id: string;
    userId: string;
    problemId: string;
    
    // For immediate UI display
    userFeedback: CodeAnalysis['feedback'];
    
    // For insights service analytics (SINGLE SOURCE OF TRUTH)
    analytics: {
      strugglingAreas: {
        category: StruggleCategory;
        intensity: StruggleIntensity;
        evidence: string;
        confidence: number;
      }[];
      metrics: CodeMetrics;
      context: CodeContext;
    };
    
    analyzedAt: string;
    status: 'completed' | 'failed';
  };
}
*/