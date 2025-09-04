import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;

// Mock NATS wrapper
jest.mock('../lib/nats-client', () => ({
  natsClient: {
    client: {
      publish: jest.fn().mockImplementation((subject: string, data: string, callback?: Function) => {
        if (callback) callback();
        return Promise.resolve();
      })
    }
  }
}));

jest.mock('../events/publisher/worksheet-created-publisher', () => ({
  WorksheetCreatedPublisher: jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock('../events/publisher/worksheet-updated-publisher', () => ({
  WorksheetUpdatedPublisher: jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock('../events/publisher/worksheet-deleted-publisher', () => ({
  WorksheetDeletedPublisher: jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined)
  }))
}));

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Clear database collections
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: `test-${Math.random()}@test.com`
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};