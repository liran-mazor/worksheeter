import jwt from 'jsonwebtoken';

// Mock NATS client globally for all tests
jest.mock('../lib/nats-client', () => ({
  natsClient: { client: {} }
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