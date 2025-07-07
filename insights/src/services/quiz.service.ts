import { prisma } from '../lib/prisma-client';
import { Difficulty, CompletionStatus } from '@prisma/client';
import { DatabaseConnectionError, BadRequestError } from '@liranmazor/common';

export class QuizService {
  async processQuizCompleteEvent(eventData: {
    worksheetId: string;
    userId: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    score: number;
    completedAt: Date | string; // Can be either after NATS serialization
  }): Promise<void> {
    // Safely convert to Date object for PostgreSQL
    let completedAtDate: Date;
    
    if (eventData.completedAt instanceof Date) {
      // It's already a Date object
      completedAtDate = eventData.completedAt;
    } else {
      // It's a string (from NATS serialization) - convert to Date
      completedAtDate = new Date(eventData.completedAt);
    }
  
    await this.updateQuizCompletion(
      eventData.worksheetId,
      eventData.userId,
      eventData.difficulty,
      eventData.score,
      completedAtDate
    );
  }
  /**
   * Update quiz completion when student completes a quiz
   */
  async updateQuizCompletion(
    worksheetId: string,
    userId: string,
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    score: number,
    completedAt: Date
  ): Promise<void> {
    if (score < 0 || score > 100) {
      throw new BadRequestError('Score must be between 0 and 100');
    }

    try {
      await prisma.quizCompletion.update({
        where: {
          worksheetId_userId_difficulty: {
            worksheetId,
            userId,
            difficulty: difficulty as Difficulty
          }
        },
        data: {
          score,
          status: CompletionStatus.COMPLETED,
          completedAt
        }
      });
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get user's average score for a specific worksheet
   */
  async getUserWorksheetAverage(worksheetId: string, userId: string): Promise<number> {
    const result = await prisma.quizCompletion.aggregate({
      where: {
        worksheetId,
        userId
      },
      _avg: {
        score: true
      }
    });

    return result._avg.score || 0;
  }

  /**
   * Get user's average across all their worksheets
   */
  async getUserAverageScore(userId: string): Promise<number> {
    const result = await prisma.quizCompletion.aggregate({
      where: {
        userId
      },
      _avg: {
        score: true
      }
    });

    return result._avg.score || 0;
  }

  /**
   * Get user's quiz completion status for a specific worksheet
   */
  async getUserWorksheetProgress(worksheetId: string, userId: string): Promise<Array<{
    difficulty: string;
    score: number;
    status: string;
    completedAt: Date | null;
  }>> {
    const completions = await prisma.quizCompletion.findMany({
      where: {
        worksheetId,
        userId
      },
      orderBy: {
        difficulty: 'asc'
      }
    });

    return completions.map(completion => ({
      difficulty: completion.difficulty,
      score: completion.score,
      status: completion.status,
      completedAt: completion.completedAt
    }));
  }

  /**
   * Get recent quiz completions (for activity tracking)
   */
  async getRecentCompletions(days: number = 7): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    userId: string;
    difficulty: string;
    score: number;
    completedAt: Date;
  }>> {
    if (days <= 0) {
      throw new BadRequestError('Days must be a positive number');
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const completions = await prisma.quizCompletion.findMany({
      where: {
        status: CompletionStatus.COMPLETED,
        completedAt: {
          gte: cutoffDate
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    return completions.map(completion => ({
      worksheetId: completion.worksheetId,
      worksheetTitle: completion.worksheetTitle,
      userId: completion.userId,
      difficulty: completion.difficulty,
      score: completion.score,
      completedAt: completion.completedAt!
    }));
  }
}

export const quizService = new QuizService();