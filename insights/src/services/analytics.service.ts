import { prisma } from '../lib/prisma-client';
import { Difficulty, CompletionStatus } from '@prisma/client';
import { DatabaseConnectionError, BadRequestError } from '@liranmazor/common';

export class AnalyticsService {
  /**
   * Create initial quiz completion records when worksheet is created
   * Pre-populates with score 0 for all 3 difficulty levels
   */
  static async createInitialQuizRecords(
    worksheetId: string,
    worksheetTitle: string,
    userId: string
  ): Promise<void> {
    if (!worksheetId || !worksheetTitle || !userId) {
      throw new BadRequestError('Missing required fields for quiz record creation');
    }

    try {
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
   * Update quiz completion when student completes a quiz
   */
  static async updateQuizCompletion(
    worksheetId: string,
    userId: string,
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    score: number,
    completedAt: Date
  ): Promise<void> {
    // Business validation
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
    * Returns (beginner + intermediate + advanced) / 3 for this user + worksheet
    */
   static async getUserWorksheetAverage(worksheetId: string, userId: string): Promise<number> {
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
   * Get worksheet average score across all students
   * Returns (beginner + intermediate + advanced) / 3 average
   */
  static async getWorksheetAverageScore(worksheetId: string): Promise<number> {
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
   * Get user's average across all their worksheets
   */
  static async getUserAverageScore(userId: string): Promise<number> {
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
   * Get worksheets with low performance (for teacher alerts)
   */
  static async getLowPerformingWorksheets(threshold: number = 70): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    averageScore: number;
    studentCount: number;
  }>> {
    // Business validation
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
   * Get user's quiz completion status for a specific worksheet
   */
  static async getUserWorksheetProgress(worksheetId: string, userId: string): Promise<Array<{
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
  static async getRecentCompletions(days: number = 7): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    userId: string;
    difficulty: string;
    score: number;
    completedAt: Date;
  }>> {
    // Business validation
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

  /**
   * Get worksheet completion statistics
   */
  static async getWorksheetStats(worksheetId: string): Promise<{
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
      beginner: this.getDifficultyStats(stats, Difficulty.BEGINNER),
      intermediate: this.getDifficultyStats(stats, Difficulty.INTERMEDIATE),
      advanced: this.getDifficultyStats(stats, Difficulty.ADVANCED)
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
   * Get worksheets with high performance (for celebrating success)
   */
  static async getTopPerformingWorksheets(threshold: number = 90): Promise<Array<{
    worksheetId: string;
    worksheetTitle: string;
    averageScore: number;
    studentCount: number;
  }>> {
    // Business validation
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
   * Get total number of worksheets that have quiz attempts
   */
  static async getTotalWorksheetsCount(): Promise<number> {
    try {
      const uniqueWorksheets = await prisma.quizCompletion.groupBy({
        by: ['worksheetId']
      });

      return uniqueWorksheets.length;
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get overall platform average score across all worksheets and students
   */
  static async getOverallPlatformAverage(): Promise<number> {
    try {
      const result = await prisma.quizCompletion.aggregate({
        _avg: {
          score: true
        },
        where: {
          status: CompletionStatus.COMPLETED
        }
      });

      return result._avg.score || 0;
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }
}