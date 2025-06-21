import { QuizCreatedListener } from './events/listener/quiz-created-listener';
import { WorksheetCreatedListener } from './events/listener/worksheet-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  
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
    throw new Error('QUEUE_GROUP_NAME must be defined');
  }
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    new WorksheetCreatedListener(natsWrapper.client).listen();
    new QuizCreatedListener(natsWrapper.client).listen();

  } catch (err) {
    console.error(err);
  }
};

start();