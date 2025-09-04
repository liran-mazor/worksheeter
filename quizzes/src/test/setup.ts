import jwt from 'jsonwebtoken';

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

declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
});

global.signin = () => {
  const payload = {
    id: Math.random().toString(36).substring(7),
    email: `test-${Math.random()}@test.com`
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};