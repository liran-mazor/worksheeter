import request from 'supertest';
import { app } from '../../app';

// Mock NATS
jest.mock('../../lib/nats-client', () => ({
  natsClient: { client: {} }
}));

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

  it('publishes NATS event when worksheet is updated', async () => {
    const userCookie = global.signin();
    
    // Create a worksheet
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Event Update Test', 
        keywords: ['event'], 
        questions: ['Will this trigger an update event?'] 
      })
      .expect(201);

    // Clear mocks after creation to isolate update event
    jest.clearAllMocks();

    // Update the worksheet
    await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: 'Updated Event Test',
        keywords: ['event', 'updated'],
        questions: ['This should trigger an update event!']
      })
      .expect(200);

    // Access the mock directly
    const { WorksheetUpdatedPublisher } = require('../../events/publisher/worksheet-updated-publisher');
    
    // The constructor should have been called once
    expect(WorksheetUpdatedPublisher).toHaveBeenCalledTimes(1);
    
    // Get the mock implementation's publish method
    const publishMock = WorksheetUpdatedPublisher.mock.results[0].value.publish;
    expect(publishMock).toHaveBeenCalledTimes(1);
    
    const eventData = publishMock.mock.calls[0][0];
    expect(eventData.id).toEqual(response.body.id);
    expect(eventData.title).toEqual('Updated Event Test');
    expect(eventData.keywords).toEqual(['event', 'updated']);
    expect(eventData.questions).toEqual(['This should trigger an update event!']);
    expect(eventData.userId).toBeDefined();
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

  it('handles NATS publishing failure gracefully', async () => {
    const userCookie = global.signin();
    
    // Create a worksheet
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'NATS Failure Update Test', 
        keywords: ['test'], 
        questions: ['What happens when update event fails?'] 
      })
      .expect(201);

    // Override the global mock for this test to make it fail
    const { WorksheetUpdatedPublisher } = require('../../events/publisher/worksheet-updated-publisher');
    WorksheetUpdatedPublisher.mockImplementationOnce(() => ({
      publish: jest.fn().mockRejectedValue(new Error('NATS connection failed'))
    }));

    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Update should still succeed even if NATS fails
    const updateResponse = await request(app)
      .put(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send({
        title: 'Updated Despite NATS Failure',
        keywords: ['test', 'updated'],
        questions: ['Update succeeded despite NATS failure!']
      })
      .expect(200);

    expect(updateResponse.body.title).toEqual('Updated Despite NATS Failure');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to publish worksheet update event:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
});