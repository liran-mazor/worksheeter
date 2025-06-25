import { prisma } from '../lib/prisma-client';
import { 
  CreateQuizData, 
  QuestionData, 
  QuizQuestions,
  QuizWithWorksheet,
  DashboardWorksheet,
  DashboardQuizInfo, 
  Quiz,
  QuizStatus, 
  Difficulty
} from '../types/quiz';
import { Worksheet, CreateWorksheetData } from '../types/worksheet';

export class QuizService {
  static async create(data: CreateQuizData): Promise<Quiz> {
    return await (prisma as any).quiz.create({
      data: {
        worksheetId: data.worksheetId,
        userId: data.userId,
        title: data.title,
        difficulty: data.difficulty,
        questions: { questions: [] }, 
        version: 1,
      },
    });
  }

  static async findById(id: string): Promise<QuizWithWorksheet | null> {
    return await (prisma as any).quiz.findUnique({
      where: { id },
      include: {
        worksheet: true,
      },
    });
  }

  static async findByWorksheetAndDifficulty(
    worksheetId: string,
    userId: string,
    difficulty: Difficulty
  ): Promise<Quiz | null> {
    return await (prisma as any).quiz.findFirst({
      where: {
        worksheetId,
        userId,
        difficulty,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async markAsAvailable(
    id: string,
    questions: QuestionData[]
  ): Promise<Quiz> {
    // Validate that we have exactly 10 questions
    if (questions.length !== 10) {
      throw new Error('Quiz must have exactly 10 questions');
    }

    // Validate each question has 4 options
    questions.forEach((q, index) => {
      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Question ${index + 1}: correct answer must be one of the options`);
      }
    });

    return await (prisma as any).quiz.update({
      where: { id },
      data: {
        status: QuizStatus.AVAILABLE,
        questions: { questions },
      },
    });
  }

  static async markAsFailed(id: string): Promise<Quiz> {
    return await (prisma as any).quiz.update({
      where: { id },
      data: {
        status: QuizStatus.FAILED,
        questions: { questions: [] },
      },
    });
  }

  static async complete(id: string, score: number): Promise<Quiz> {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }

    return await (prisma as any).quiz.update({
      where: { id },
      data: {
        status: QuizStatus.COMPLETED,
        score,
        completedAt: new Date(),
      },
    });
  }

  static async exists(
    worksheetId: string,
    userId: string,
    difficulty: Difficulty
  ): Promise<boolean> {
    const quiz = await (prisma as any).quiz.findFirst({
      where: {
        worksheetId,
        userId,
        difficulty,
      },
      select: { id: true },
    });
    return !!quiz;
  }

  static async getQuestions(id: string): Promise<QuestionData[]> {
    const quiz = await (prisma as any).quiz.findUnique({
      where: { id },
      select: { questions: true, status: true },
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    if (quiz.status !== QuizStatus.AVAILABLE) {
      throw new Error('Quiz is not available');
    }

    const questionsData = quiz.questions as QuizQuestions;
    return questionsData.questions;
  }

  static async getDashboardData(userId: string): Promise<DashboardWorksheet[]> {
    // Single optimized query with joins
    const worksheetsWithQuizzes = await (prisma as any).worksheet.findMany({
      where: { userId },
      include: {
        quizzes: {
          select: {
            id: true,
            difficulty: true,
            status: true,
            score: true,
            completedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return worksheetsWithQuizzes.map((worksheet: any) => {
      // Get latest quiz for each difficulty
      const getLatestQuizByDifficulty = (difficulty: Difficulty) => {
        return worksheet.quizzes.find((quiz: any) => quiz.difficulty === difficulty);
      };

      const beginnerQuiz = getLatestQuizByDifficulty(Difficulty.BEGINNER);
      const intermediateQuiz = getLatestQuizByDifficulty(Difficulty.INTERMEDIATE);
      const advancedQuiz = getLatestQuizByDifficulty(Difficulty.ADVANCED);

      const getQuizStatus = (quiz: any, isLocked: boolean): DashboardQuizInfo => {
        if (isLocked) {
          return { status: 'locked' };
        }
        
        if (!quiz) {
          return { status: 'available' };
        }
        
        if (quiz.status === QuizStatus.COMPLETED) {
          return { 
            status: 'completed', 
            score: quiz.score, 
            quizId: quiz.id,
            completedAt: quiz.completedAt
          };
        }
        
        if (quiz.status === QuizStatus.PROCESSING) {
          return { status: 'processing', quizId: quiz.id };
        }
        
        if (quiz.status === QuizStatus.FAILED) {
          return { status: 'failed', quizId: quiz.id };
        }
        
        if (quiz.status === QuizStatus.AVAILABLE) {
          return { status: 'available', quizId: quiz.id };
        }
        
        return { status: 'available', quizId: quiz.id };
      };

      // Determine if each difficulty is locked based on completion of previous levels
      const isBeginnerLocked = false; // Beginner is never locked
      const isIntermediateLocked = !beginnerQuiz || beginnerQuiz.status !== QuizStatus.COMPLETED;
      const isAdvancedLocked = !intermediateQuiz || intermediateQuiz.status !== QuizStatus.COMPLETED;

      return {
        worksheetId: worksheet.id,
        worksheetTitle: worksheet.title,
        createdAt: worksheet.createdAt,
        keywordsCount: worksheet.keywords.length,
        quizProgress: {
          beginner: getQuizStatus(beginnerQuiz, isBeginnerLocked),
          intermediate: getQuizStatus(intermediateQuiz, isIntermediateLocked),
          advanced: getQuizStatus(advancedQuiz, isAdvancedLocked),
        },
      };
    });
  }

  static async getUserQuizzes(userId: string): Promise<Quiz[]> {
    return await (prisma as any).quiz.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getWorksheetQuizzes(worksheetId: string, userId: string): Promise<Quiz[]> {
    return await (prisma as any).quiz.findMany({
      where: { worksheetId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async canAccessDifficulty(
    worksheetId: string,
    userId: string,
    difficulty: Difficulty
  ): Promise<boolean> {
    if (difficulty === Difficulty.BEGINNER) {
      return true; // Beginner is always accessible
    }

    const previousDifficulty = difficulty === Difficulty.INTERMEDIATE 
      ? Difficulty.BEGINNER 
      : Difficulty.INTERMEDIATE;

    const previousQuiz = await (prisma as any).quiz.findFirst({
      where: {
        worksheetId,
        userId,
        difficulty: previousDifficulty,
      },
      select: { status: true },
    });

    return previousQuiz && previousQuiz.status === QuizStatus.COMPLETED;
  }
}