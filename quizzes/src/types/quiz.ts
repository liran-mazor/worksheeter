import { Worksheet, CreateWorksheetData } from './worksheet';

// Enums from schema.prisma
export enum QuizStatus {
  PROCESSING = 'PROCESSING',
  AVAILABLE = 'AVAILABLE', 
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Quiz {
  id: string;
  worksheetId: string;
  userId: string;
  title: string;
  difficulty: Difficulty;
  questions: any; 
  status: QuizStatus;
  score?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  worksheet?: Worksheet;
}

export interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizQuestions {
  questions: QuestionData[];
}

export interface CreateQuizData {
  worksheetId: string;
  userId: string;
  title: string;
  difficulty: Difficulty;
}

export interface QuizWithWorksheet extends Quiz {
  worksheet: Worksheet;
}

export interface DashboardQuizInfo {
  status: 'locked' | 'available' | 'processing' | 'failed' | 'completed';
  score?: number;
  quizId?: string;
  completedAt?: Date;
}

export interface DashboardWorksheet {
  worksheetId: string;
  worksheetTitle: string;
  createdAt: Date;
  keywordsCount: number;
  quizProgress: {
    beginner: DashboardQuizInfo;
    intermediate: DashboardQuizInfo;
    advanced: DashboardQuizInfo;
  };
}

// Re-export Worksheet types for convenience
export { Worksheet, CreateWorksheetData };