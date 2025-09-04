import request from 'supertest';
import { app } from '../../app';

describe('POST /api/worksheets', () => {
  it('returns 400 when no data is provided', async () => {
    await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send({})
      .expect(400);
  });

  it('creates a worksheet successfully', async () => {
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send({
        title: 'My Test Worksheet',
        keywords: ['javascript', 'testing', 'nodejs'],
        questions: [
          'What is a function?',
          'How do you write a test?',
          'What is Express.js?'
        ]
      })
      .expect(201);

    expect(response.body.title).toEqual('My Test Worksheet');
    expect(response.body.keywords).toEqual(['javascript', 'testing', 'nodejs']);
    expect(response.body.questions).toHaveLength(3);
    expect(response.body.userId).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it('fails when invalid title is provided', async () => {
    await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        keywords: ['javascript', 'testing'],
        questions: ['What is a function?']
      })
      .expect(400);
  });

  it('fails when invalid keywords are provided', async () => {
    await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send({
        title: 'My Test Worksheet',
        keywords: 'not-an-array',
        questions: ['What is a function?']
      })
      .expect(400);
  });

  it('fails when invalid questions are provided', async () => {
    await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send({
        title: 'My Test Worksheet',
        keywords: ['javascript', 'testing'],
        questions: 'not-an-array'
      })
      .expect(400);
  });

});