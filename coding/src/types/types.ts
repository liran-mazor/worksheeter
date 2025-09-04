export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Response {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  executionTime?: string;
  memory?: number;
  error?: string;
}

export interface Problem {
 id: string;
 title: string;
 description: string;
 difficulty: 'easy' | 'medium' | 'hard';
 category: string;
 functionName: string;
 testCases: { input: string; expectedOutput: string }[];
 examples: { input: string; output: string; explanation?: string }[];
 constraints?: string[];
}

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['javascript', 'python', 'java', 'cpp', 'c'];
