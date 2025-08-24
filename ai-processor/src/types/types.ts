export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface KeywordDefinition {
 keyword: string;
 definition: string;
}

export interface QuestionAnswer {
 question: string;
 answer: string;
}

export interface AudioProcessingResult {
  transcript: string;
  summary: string;
  keyTopics: string[];
}

export interface VideoSessionProcessingData {
  id: string;
  title: string;
  userId: string;
  recordingUrl: string;
  duration?: number;
}