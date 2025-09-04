import request from 'supertest';
import { app } from '../../app';

describe('DELETE /api/worksheets/:id', () => {
  it('returns 404 if the worksheet is not found', async () => {
    const id = '507f1f77bcf86cd799439011';
    await request(app)
      .delete(`/api/worksheets/${id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('deletes the worksheet successfully and returns 204', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Worksheet to Delete', 
        keywords: ['test', 'delete'], 
        questions: ['Will this be deleted?'] 
      })
      .expect(201);

    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(204);
  });

  it('publishes NATS event when worksheet is deleted', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Event Delete Test', 
        keywords: ['event', 'delete'], 
        questions: ['Will this trigger an event?'] 
      })
      .expect(201);

    jest.clearAllMocks();

    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(204);

    // Access the globally mocked publisher
    const { WorksheetDeletedPublisher } = require('../../events/publisher/worksheet-deleted-publisher');
    
    // The constructor should have been called
    expect(WorksheetDeletedPublisher).toHaveBeenCalledTimes(1);
    
    // Get the mock implementation's publish method
    const publishMock = WorksheetDeletedPublisher.mock.results[0].value.publish;
    expect(publishMock).toHaveBeenCalledTimes(1);
    
    const eventData = publishMock.mock.calls[0][0];
    expect(eventData.id).toEqual(response.body.id);
    expect(eventData.userId).toBeDefined();
  });

  it('prevents other users from deleting worksheets they do not own', async () => {
    const userOneCookie = global.signin();
    const userTwoCookie = global.signin();
    
    // User One creates a worksheet
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userOneCookie)
      .send({ 
        title: 'Private Worksheet', 
        keywords: ['private'], 
        questions: ['Can others delete this?'] 
      })
      .expect(201);

    // User Two tries to delete User One's worksheet
    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userTwoCookie)
      .send()
      .expect(401);
  });

  it('handles NATS publishing failure gracefully', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'NATS Failure Delete Test', 
        keywords: ['test'], 
        questions: ['What happens when deletion event fails?'] 
      })
      .expect(201);

    // Override the global mock for this test to make it fail
    const { WorksheetDeletedPublisher } = require('../../events/publisher/worksheet-deleted-publisher');
    WorksheetDeletedPublisher.mockImplementationOnce(() => ({
      publish: jest.fn().mockRejectedValue(new Error('NATS connection failed'))
    }));

    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Delete should still succeed even if NATS fails
    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(204);

    expect(console.error).toHaveBeenCalledWith(
      'Failed to publish worksheet deletion event:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
});