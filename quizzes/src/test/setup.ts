import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_ENV = "test";
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