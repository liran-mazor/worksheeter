import request from 'supertest';
import { app } from '../../app';

jest.mock('../../events/publisher/quiz-created-publisher', () => ({
  QuizCreatedPublisher: jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined)
  }))
}));

// Mock the entire service modules (like your working tests)
jest.mock('../../services/quiz.service', () => ({
  QuizService: {
    findByWorksheetAndDifficulty: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../services/worksheet.service', () => ({
  WorksheetService: {
    findById: jest.fn()
  }
}));

describe('POST /api/quizzes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new quiz successfully when authenticated', async () => {
    const { QuizService } = require('../../services/quiz.service');
    const { WorksheetService } = require('../../services/worksheet.service');

    // Mock service responses
    WorksheetService.findById.mockResolvedValue({
      id: 'worksheet-1',
      title: 'Test Worksheet',
      keywords: ['test']
    });
    QuizService.findByWorksheetAndDifficulty.mockResolvedValue(null);
    QuizService.create.mockResolvedValue({
      id: 'quiz-1',
      worksheetId: 'worksheet-1',
      difficulty: 'BEGINNER',
      status: 'PROCESSING'
    });

    const response = await request(app)
      .post('/api/quizzes')
      .set('Cookie', global.signin())
      .send({
        worksheetId: 'worksheet-1',
        difficulty: 'BEGINNER'
      })
      .expect(201);

    expect(response.body.difficulty).toBe('BEGINNER');
    
    // Verify publisher was called
    const { QuizCreatedPublisher } = require('../../events/publisher/quiz-created-publisher');
    expect(QuizCreatedPublisher).toHaveBeenCalled();
  });

});



