import request from 'supertest';
import { app } from '../../app';

// Mock NATS
jest.mock('../../lib/nats-client', () => ({
  natsClient: { client: {} }
}));

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

  it('publishes NATS event when worksheet is created', async () => {
    const worksheetData = {
      title: 'Event Test Worksheet',
      keywords: ['event', 'testing'],
      questions: ['How do events work?']
    };

    await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send(worksheetData)
      .expect(201);

    // Access the globally mocked publisher
    const { WorksheetCreatedPublisher } = require('../../events/publisher/worksheet-created-publisher');
    
    // The constructor should have been called
    expect(WorksheetCreatedPublisher).toHaveBeenCalledTimes(1);
    
    // Get the mock implementation's publish method
    const publishMock = WorksheetCreatedPublisher.mock.results[0].value.publish;
    expect(publishMock).toHaveBeenCalledTimes(1);
    
    const eventData = publishMock.mock.calls[0][0];
    expect(eventData.title).toEqual('Event Test Worksheet');
    expect(eventData.keywords).toEqual(['event', 'testing']);
    expect(eventData.questions).toEqual(['How do events work?']);
    expect(eventData.userId).toBeDefined();
    expect(eventData.id).toBeDefined();
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

  it('handles NATS publishing failure gracefully', async () => {
    // Override the global mock for this test to make it fail
    const { WorksheetCreatedPublisher } = require('../../events/publisher/worksheet-created-publisher');
    WorksheetCreatedPublisher.mockImplementationOnce(() => ({
      publish: jest.fn().mockRejectedValue(new Error('NATS connection failed'))
    }));

    const worksheetData = {
      title: 'NATS Failure Test',
      keywords: ['test'],
      questions: ['What happens when NATS fails?']
    };

    // Suppress console.error for this test since we're intentionally causing an error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', global.signin())
      .send(worksheetData)
      .expect(201);

    expect(response.body.title).toEqual('NATS Failure Test');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to publish worksheet creation event:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
});