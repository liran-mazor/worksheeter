import { prisma } from '../lib/prisma-client';
import { Difficulty, CompletionStatus } from '@prisma/client';
import { DatabaseConnectionError, BadRequestError } from '@liranmazor/common';

export class WorksheetService {
  /**
   * Create initial quiz completion records when worksheet is created
   * Pre-populates with score 0 for all 3 difficulty levels
   */
  async createInitialQuizRecords(
    worksheetId: string,
    worksheetTitle: string,
    userId: string
  ): Promise<void> {
    if (!worksheetId || !worksheetTitle || !userId) {
      throw new BadRequestError('Missing required fields for quiz record creation');
    }

    try {
      // Check if records already exist to avoid duplicate creation
      const existingRecords = await prisma.quizCompletion.findMany({
        where: {
          worksheetId,
          userId
        }
      });

      if (existingRecords.length > 0) {
        throw new BadRequestError('Quiz records already exist for worksheet and user');
      }

      // Create new records only if they don't exist
      await prisma.quizCompletion.createMany({
        data: [
          {
            worksheetId,
            worksheetTitle,
            userId,
            difficulty: Difficulty.BEGINNER,
            score: 0,
            status: CompletionStatus.NOT_ATTEMPTED
          },
          {
            worksheetId,
            worksheetTitle,
            userId,
            difficulty: Difficulty.INTERMEDIATE,
            score: 0,
            status: CompletionStatus.NOT_ATTEMPTED
          },
          {
            worksheetId,
            worksheetTitle,
            userId,
            difficulty: Difficulty.ADVANCED,
            score: 0,
            status: CompletionStatus.NOT_ATTEMPTED
          }
        ]
      });
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get worksheets with low performance (for teacher alerts)
   */
  async getLowPerformingWorksheets(threshold: number = 70): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    averageScore: number;
    studentCount: number;
  }>> {
    if (threshold < 0 || threshold > 100) {
      throw new BadRequestError('Threshold must be between 0 and 100');
    }

    try {
      const worksheets = await prisma.quizCompletion.groupBy({
        by: ['worksheetId', 'worksheetTitle'],
        _avg: {
          score: true
        },
        _count: {
          userId: true
        },
        having: {
          score: {
            _avg: {
              lt: threshold
            }
          }
        }
      });

      return worksheets.map(worksheet => ({
        worksheetId: worksheet.worksheetId,
        worksheetTitle: worksheet.worksheetTitle,
        averageScore: worksheet._avg.score || 0,
        studentCount: worksheet._count.userId
      }));
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get worksheets with high performance (for celebrating success)
   */
  async getTopPerformingWorksheets(threshold: number = 90): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    averageScore: number;
    studentCount: number;
  }>> {
    if (threshold < 0 || threshold > 100) {
      throw new BadRequestError('Threshold must be between 0 and 100');
    }

    try {
      const worksheets = await prisma.quizCompletion.groupBy({
        by: ['worksheetId', 'worksheetTitle'],
        _avg: {
          score: true
        },
        _count: {
          userId: true
        },
        having: {
          score: {
            _avg: {
              gte: threshold
            }
          }
        }
      });

      return worksheets.map(worksheet => ({
        worksheetId: worksheet.worksheetId,
        worksheetTitle: worksheet.worksheetTitle,
        averageScore: worksheet._avg.score || 0,
        studentCount: worksheet._count.userId
      }));
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get worksheet average score across all students
   */
  async getWorksheetAverageScore(worksheetId: string): Promise<number> {
    const result = await prisma.quizCompletion.aggregate({
      where: {
        worksheetId
      },
      _avg: {
        score: true
      }
    });

    return result._avg.score || 0;
  }

  /**
   * Get worksheet completion statistics
   */
  async getWorksheetStats(worksheetId: string): Promise<{
    totalStudents: number;
    averageScore: number;
    completionRate: number;
    difficultyBreakdown: {
      beginner: { completed: number; averageScore: number };
      intermediate: { completed: number; averageScore: number };
      advanced: { completed: number; averageScore: number };
    };
  }> {
    const stats = await prisma.quizCompletion.groupBy({
      by: ['difficulty', 'status'],
      where: {
        worksheetId
      },
      _count: {
        userId: true
      },
      _avg: {
        score: true
      }
    });

    const totalStudents = await prisma.quizCompletion.count({
      where: {
        worksheetId,
        difficulty: Difficulty.BEGINNER
      }
    });

    const completedCount = stats
      .filter(stat => stat.status === CompletionStatus.COMPLETED)
      .reduce((sum, stat) => sum + stat._count.userId, 0);

    const overallAverage = stats
      .filter(stat => stat.status === CompletionStatus.COMPLETED)
      .reduce((sum, stat, _, arr) => {
        return sum + (stat._avg.score || 0) / arr.length;
      }, 0);

    const difficultyBreakdown = {
      beginner: WorksheetService.getDifficultyStats(stats, Difficulty.BEGINNER),
      intermediate: WorksheetService.getDifficultyStats(stats, Difficulty.INTERMEDIATE),
      advanced: WorksheetService.getDifficultyStats(stats, Difficulty.ADVANCED)
    };

    return {
      totalStudents,
      averageScore: overallAverage,
      completionRate: totalStudents > 0 ? (completedCount / (totalStudents * 3)) * 100 : 0,
      difficultyBreakdown
    };
  }

  private static getDifficultyStats(stats: any[], difficulty: Difficulty) {
    const difficultyStats = stats.find(
      stat => stat.difficulty === difficulty && stat.status === CompletionStatus.COMPLETED
    );
    
    return {
      completed: difficultyStats?._count.userId || 0,
      averageScore: difficultyStats?._avg.score || 0
    };
  }

  /**
   * Get total number of worksheets that have quiz attempts
   */
  async getTotalWorksheetsCount(): Promise<number> {
    try {
      const uniqueWorksheets = await prisma.quizCompletion.groupBy({
        by: ['worksheetId']
      });

      return uniqueWorksheets.length;
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }
}

export const worksheetService = new WorksheetService();