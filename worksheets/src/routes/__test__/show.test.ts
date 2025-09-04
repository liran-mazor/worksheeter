import request from 'supertest';
import { app } from '../../app';

// Mock NATS
jest.mock('../../lib/nats-client', () => ({
  natsClient: { client: {} }
}));

describe('GET /api/worksheets/:id', () => {
  it('returns 404 if the worksheet is not found', async () => {
    const id = '507f1f77bcf86cd799439011';
    await request(app)
      .get(`/api/worksheets/${id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('returns the worksheet if the worksheet is found', async () => {
    const cookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', cookie)
      .send({ 
        title: 'My Test Worksheet', 
        keywords: ['javascript', 'testing', 'nodejs'], 
        questions: ['What is a function?', 'How do you write a test?', 'What is Express.js?'] 
      })
      .expect(201);

    const showResponse = await request(app)
      .get(`/api/worksheets/${response.body.id}`)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(showResponse.body.title).toEqual('My Test Worksheet');
    expect(showResponse.body.keywords).toEqual(['javascript', 'testing', 'nodejs']);
    expect(showResponse.body.questions).toHaveLength(3);
    expect(showResponse.body.id).toEqual(response.body.id);
    expect(showResponse.body.userId).toBeDefined();
  });

  it('prevents other users from viewing worksheets they did not create', async () => {
    const userOneCookie = global.signin();
    const userTwoCookie = global.signin();

    const createResponse = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userOneCookie)
      .send({
        title: 'User One Private Worksheet',
        keywords: ['secret', 'private'],
        questions: ['What is my private data?']
      })
      .expect(201);

    await request(app)
      .get(`/api/worksheets/${createResponse.body.id}`)
      .set('Cookie', userTwoCookie)
      .send()
      .expect(404);
  });

  it('returns complete worksheet data with all fields', async () => {
    const userCookie = global.signin();
    
    const worksheetData = {
      title: 'Complete Data Test',
      keywords: ['complete', 'data', 'fields', 'test'],
      questions: [
        'What is the title?',
        'What are the keywords?', 
        'What are the questions?',
        'Who is the user?'
      ]
    };

    const createResponse = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send(worksheetData)
      .expect(201);

    const showResponse = await request(app)
      .get(`/api/worksheets/${createResponse.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(200);

    expect(showResponse.body.title).toEqual(worksheetData.title);
    expect(showResponse.body.keywords).toEqual(worksheetData.keywords);
    expect(showResponse.body.questions).toEqual(worksheetData.questions);
    expect(showResponse.body.userId).toBeDefined();
    expect(showResponse.body.id).toBeDefined();
    expect(showResponse.body.createdAt).toBeDefined();
    expect(showResponse.body.updatedAt).toBeDefined();
    expect(showResponse.body.version).toBeDefined();
  });

  it('handles invalid MongoDB ObjectId gracefully', async () => {
    const invalidId = 'invalid-object-id';
    
    await request(app)
      .get(`/api/worksheets/${invalidId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(400);
  })

  it('allows user to view their own worksheet multiple times', async () => {
    const userCookie = global.signin();
    
    const createResponse = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({
        title: 'Multiple Views Test',
        keywords: ['multiple', 'views'],
        questions: ['Can I view this multiple times?']
      })
      .expect(201);

    const firstView = await request(app)
      .get(`/api/worksheets/${createResponse.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(200);

    const secondView = await request(app)
      .get(`/api/worksheets/${createResponse.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(200);

    expect(firstView.body.id).toEqual(secondView.body.id);
    expect(firstView.body.title).toEqual(secondView.body.title);
    expect(firstView.body.version).toEqual(secondView.body.version);
  });
});