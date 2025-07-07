import { prisma } from '../lib/prisma-client';
import { DatabaseConnectionError, BadRequestError } from '@liranmazor/common';

export class CodeService {
  /**
   * Store code analysis data when student completes a coding challenge
   */
  async storeCodeAnalysis(data: {
    id: string;
    userId: string;
    problemId: string;
    codeQuality: number;
    algorithmCorrectness: number;
    syntaxAccuracy: number;
    edgeCaseHandling: number;
    readability: number;
    problemDifficulty: 'easy' | 'medium' | 'hard';
    codeLength: number;
    languageFeatures: string[];
    strugglingAreas: Array<{
      category: string;
      intensity: string;
      evidence: string;
      confidence: number;
    }>;
    analyzedAt: Date;
  }): Promise<void> {
    try {
      // This would store in a CodeAnalysis table when you create the Prisma schema
      // For now, we'll prepare the structure
      console.log('📊 Code analysis data received:', {
        submissionId: data.id,
        userId: data.userId,
        problemId: data.problemId,
        metrics: {
          codeQuality: data.codeQuality,
          algorithmCorrectness: data.algorithmCorrectness,
          syntaxAccuracy: data.syntaxAccuracy,
          edgeCaseHandling: data.edgeCaseHandling,
          readability: data.readability
        },
        context: {
          problemDifficulty: data.problemDifficulty,
          codeLength: data.codeLength,
          languageFeatures: data.languageFeatures
        },
        strugglingAreas: data.strugglingAreas.length,
        analyzedAt: data.analyzedAt
      });

      // TODO: Implement when CodeAnalysis Prisma model is ready
      // await prisma.codeAnalysis.create({ data: ... });
      
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get user's coding performance metrics
   */
  async getUserCodingStats(userId: string): Promise<{
    averageCodeQuality: number;
    averageAlgorithmCorrectness: number;
    averageSyntaxAccuracy: number;
    totalSubmissions: number;
    commonStruggles: Array<{
      category: string;
      frequency: number;
    }>;
  }> {
    try {
      // TODO: Implement when CodeAnalysis table exists
      // For now return mock structure
      return {
        averageCodeQuality: 0,
        averageAlgorithmCorrectness: 0,
        averageSyntaxAccuracy: 0,
        totalSubmissions: 0,
        commonStruggles: []
      };
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  /**
   * Get problem difficulty breakdown for user
   */
  async getUserProblemDifficultyStats(userId: string): Promise<{
    easy: { solved: number; averageScore: number };
    medium: { solved: number; averageScore: number };
    hard: { solved: number; averageScore: number };
  }> {
    try {
      // TODO: Implement when CodeAnalysis table exists
      return {
        easy: { solved: 0, averageScore: 0 },
        medium: { solved: 0, averageScore: 0 },
        hard: { solved: 0, averageScore: 0 }
      };
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }
}

export const codeService = new CodeService();
