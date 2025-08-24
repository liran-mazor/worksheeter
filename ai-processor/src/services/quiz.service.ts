import { claudeClient } from '../lib/claude-client';
import { ClaudeApiError } from '@liranmazor/common';
import { QuizQuestion } from '../types/types';

export class QuizService {
  private validateQuizQuestions(questions: any[], operation: string): QuizQuestion[] {
    if (questions.length !== 10) {
      throw new Error(`Expected exactly 10 questions but got ${questions.length}`);
    }

    questions.forEach((item, i) => {
      if (!item.question || !item.options || !item.correctAnswer) {
        throw new Error(`Question ${i + 1}: Missing required fields`);
      }

      if (!Array.isArray(item.options) || item.options.length !== 4) {
        throw new Error(`Question ${i + 1}: Must have exactly 4 options`);
      }

      if (!item.options.includes(item.correctAnswer)) {
        throw new Error(`Question ${i + 1}: Correct answer must be one of the provided options`);
      }
    });

    return questions;
  }

  async generateQuizQuestions(
    keywords: string[], 
    title: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<QuizQuestion[]> {
    const operation = 'quiz generation';
    
    try {
      if (!keywords?.length) {
        throw new Error('No keywords provided');
      }
      if (!title?.trim()) {
        throw new Error('No title provided');
      }
      
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        throw new Error(`Invalid difficulty level: ${difficulty}`);
      }

      const difficultyPrompts = {
        beginner: 'basic, introductory level questions suitable for someone just learning about this topic',
        intermediate: 'moderate difficulty questions requiring some understanding and application of concepts',
        advanced: 'challenging questions requiring deep knowledge and critical thinking about the subject'
      };

      const prompt = `Create exactly 10 multiple choice quiz questions about "${title}" focusing on these keywords: ${keywords.join(', ')}.

        Make ${difficultyPrompts[difficulty]}. Each question should:
        - Be clear and unambiguous
        - Have exactly 4 options (A, B, C, D)  
        - Have only one correct answer
        - Be relevant to the keywords and subject matter
        - Test understanding of "${title}" concepts

        IMPORTANT: Distribute the correct answers randomly across options A, B, C, and D. 
        Do NOT make all correct answers option A. Mix them up naturally.
        - Aim for roughly 2-3 questions with answer A
        - Aim for roughly 2-3 questions with answer B  
        - Aim for roughly 2-3 questions with answer C
        - Aim for roughly 2-3 questions with answer D

        Format as JSON array with this exact structure:
        [
          {
            "question": "What is...",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B"
          }
        ]

        Make sure the "correctAnswer" field contains the EXACT text from one of the four options.
        Respond only with valid JSON, no additional text.`;

      const responseText = await claudeClient.callClaude(prompt, 4000, operation);
      const parsedResponse = claudeClient.parseJsonResponse<any[]>(responseText, operation);
      
      if (!Array.isArray(parsedResponse)) {
        throw new ClaudeApiError(operation, 'Expected JSON array');
      }
      
      return this.validateQuizQuestions(parsedResponse, operation);
    } catch (error) {
      throw new ClaudeApiError(operation, error);
    }
  }
}
export const quizService = new QuizService();