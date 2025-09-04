import request from 'supertest';
import { app } from '../../app';

// Mock NATS
jest.mock('../../lib/nats-client', () => ({
  natsClient: { client: {} }
}));

it('returns a list of worksheets', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/worksheets')
    .set('Cookie', cookie)
    .send({ 
      title: 'My Test Worksheet', 
      keywords: ['javascript', 'testing', 'nodejs'], 
      questions: ['What is a function?', 'How do you write a test?', 'What is Express.js?'] 
    })
    .expect(201);

  await request(app)
    .post('/api/worksheets')
    .set('Cookie', cookie)
    .send({
      title: 'My Second Test Worksheet', 
      keywords: ['javascript', 'testing', 'nodejs'], 
      questions: ['What is a function?', 'How do you write a test?', 'What is Express.js?']
    })
    .expect(201);

  const response = await request(app)
    .get('/api/worksheets')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(2);
  
  expect(response.body[0].title).toEqual('My Second Test Worksheet');
  expect(response.body[1].title).toEqual('My Test Worksheet');
});