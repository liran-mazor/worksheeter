import { app } from './app';
import { natsClient } from './lib/nats-client';
import { QuizCompleteListener } from './events/quiz-complete-listener';
import { CodeAnalyzedListener } from './events/code-analyzed-listener';
import { prisma } from './lib/prisma-client';
import { WorksheetCreatedListener } from './events/worksheet-created-listener';
import { vectorClient } from './lib/vector-client';
import { vectorService } from './services/vector.service';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.QUEUE_GROUP_NAME) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY must be defined');
  }
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY must be defined');
  }
  
  try {
    await vectorClient.connect();
    await vectorService.initialize();
    
    await prisma.$connect();
    console.log('Connected to PostgreSQL');
    
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsClient.setupGracefulShutdown();
    
    new QuizCompleteListener(natsClient.client).listen();
    new CodeAnalyzedListener(natsClient.client).listen();
    new WorksheetCreatedListener(natsClient.client).listen();
    
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();