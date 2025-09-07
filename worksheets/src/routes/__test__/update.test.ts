import request from 'supertest';
import { app } from '../../app';

describe('PUT /api/worksheets/:id', () => {
  it('returns 404 if the worksheet is not found', async () => {
    const id = '507f1f77bcf86cd799439011';
    await request(app)
      .put(`/api/worksheets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'Updated Worksheet',
        keywords: ['updated', 'test'],
        questions: ['Updated question?']
      })  
      .expect(404);
  });

  it('returns 400 when invalid data is provided', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Original Worksheet', 
        keywords: ['test'], 
        questions: ['Original question?'] 
      })
      .expect(201);

    await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: '', // Invalid empty title
        keywords: ['updated'],
        questions: ['Updated question?']
      })
      .expect(400);
  });

  it('updates the worksheet successfully and returns 200', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Original Worksheet', 
        keywords: ['javascript', 'original'], 
        questions: ['What is the original question?'] 
      })
      .expect(201);

    const updateResponse = await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: 'Updated Worksheet Title',
        keywords: ['javascript', 'updated', 'testing'],
        questions: ['What is the updated question?', 'What changed?']
      })
      .expect(200);

    expect(updateResponse.body.title).toEqual('Updated Worksheet Title');
    expect(updateResponse.body.keywords).toEqual(['javascript', 'updated', 'testing']);
    expect(updateResponse.body.questions).toHaveLength(2);
    expect(updateResponse.body.questions[0]).toEqual('What is the updated question?');
  });

  it('prevents other users from updating worksheets they do not own', async () => {
    const userOneCookie = global.signin();
    const userTwoCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userOneCookie)
      .send({ 
        title: 'Private Worksheet', 
        keywords: ['private'], 
        questions: ['Can others update this?'] 
      })
      .expect(201);

    await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userTwoCookie)
      .send({
        title: 'Hijacked Worksheet',
        keywords: ['hacked'],
        questions: ['I should not be able to do this!']
      })
      .expect(401);
  });

  it('fails when invalid keywords are provided', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Test Worksheet', 
        keywords: ['test'], 
        questions: ['Test question?'] 
      })
      .expect(201);

    await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: 'Updated Title',
        keywords: 'not-an-array', // Invalid
        questions: ['Valid question?']
      })
      .expect(400);
  });

  it('fails when invalid questions are provided', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Test Worksheet', 
        keywords: ['test'], 
        questions: ['Test question?'] 
      })
      .expect(201);

    await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: 'Updated Title',
        keywords: ['valid'],
        questions: 'not-an-array' // Invalid
      })
      .expect(400);
  });
});