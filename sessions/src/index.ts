import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './lib/nats-client';

const strat = async () => {
  if (!process.env.JWT_KEY){    
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI){    
    throw new Error('MONGO_URI must be defined');
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
    throw new Error('QUEUE_GROUP_NAME must be defined');
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongoD');

    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsClient.setupGracefulShutdown();
    
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

strat();
