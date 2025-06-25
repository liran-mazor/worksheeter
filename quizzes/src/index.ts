import { app } from './app';
import { natsClient } from './lib/nats-client';
import { WorksheetCreatedListener } from './events/listener/worksheet-created-listener';
import { WorksheetDeletedListener } from './events/listener/worksheet-deleted-listener';
import { WorksheetUpdatedListener } from './events/listener/worksheet-updated-listener';
import { QuizGeneratedListener } from './events/listener/quiz-generated-listener';
import { prisma } from './lib/prisma-client';

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
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.QUEUE_GROUP_NAME) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {

    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsClient.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsClient.client.close());
    process.on('SIGTERM', () => natsClient.client.close());
    
    new WorksheetCreatedListener(natsClient.client).listen();
    new WorksheetDeletedListener(natsClient.client).listen();
    new WorksheetUpdatedListener(natsClient.client).listen();
    new QuizGeneratedListener(natsClient.client).listen();

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();