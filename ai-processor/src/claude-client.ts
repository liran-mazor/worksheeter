import Anthropic from '@anthropic-ai/sdk';
import { ClaudeApiError } from '@liranmazor/ticketing-common';

interface KeywordDefinition {
  keyword: string;
  definition: string;
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export class ClaudeClient {
  private client: Anthropic;

  constructor() {
    if (!process.env.CLAUDE_API_KEY) {
      throw new ClaudeApiError('initialization', new Error('CLAUDE_API_KEY environment variable is not set'));
    }

    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY!,
    });
  }

  private validateInputs(keywords: string[], title: string, operation: string): void {
    if (!keywords?.length) {
      throw new ClaudeApiError(operation, new Error('No keywords provided'));
    }
    if (!title?.trim()) {
      throw new ClaudeApiError(operation, new Error('No title provided'));
    }
  }

  private async callClaude(prompt: string, maxTokens: number, operation: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new ClaudeApiError(operation, new Error('Unexpected response format - expected text content'));
    }

    return content.text;
  }

  private parseJsonResponse<T>(jsonText: string, operation: string): T {
    try {
      return JSON.parse(jsonText);
    } catch (jsonError) {
      console.error(`Claude returned invalid JSON for ${operation}:`, jsonText);
      throw new ClaudeApiError(operation, jsonError);
    }
  }

  private validateArray<T>(data: any, operation: string): T[] {
    if (!Array.isArray(data)) {
      throw new ClaudeApiError(operation, new Error('Expected JSON array but got different format'));
    }
    return data;
  }

  private validateKeywordDefinitions(definitions: any[], operation: string): KeywordDefinition[] {
    for (const item of definitions) {
      if (!item.keyword || !item.definition) {
        throw new ClaudeApiError(operation, new Error('Invalid keyword definition format - missing keyword or definition field'));
      }
    }
    return definitions;
  }

  private validateQuestionAnswers(answers: any[], operation: string): QuestionAnswer[] {
    for (const item of answers) {
      if (!item.question || !item.answer) {
        throw new ClaudeApiError(operation, new Error('Invalid question answer format - missing question or answer field'));
      }
    }
    return answers;
  }

  private validateQuizQuestions(questions: any[], operation: string): QuizQuestion[] {
    if (questions.length !== 10) {
      throw new ClaudeApiError(operation, new Error(`Expected exactly 10 questions but got ${questions.length}`));
    }

    questions.forEach((item, i) => {
      if (!item.question || !item.options || !item.correctAnswer) {
        throw new ClaudeApiError(operation, new Error(`Question ${i + 1}: Missing required fields`));
      }

      if (!Array.isArray(item.options) || item.options.length !== 4) {
        throw new ClaudeApiError(operation, new Error(`Question ${i + 1}: Must have exactly 4 options`));
      }

      if (!item.options.includes(item.correctAnswer)) {
        throw new ClaudeApiError(operation, new Error(`Question ${i + 1}: Correct answer must be one of the provided options`));
      }
    });

    return questions;
  }

  async generateKeywordDefinitions(keywords: string[],
    title: string): Promise<KeywordDefinition[]> {
      const operation = 'keyword generation';
      
      try {
        this.validateInputs(keywords, title, operation);

        const prompt = `Please provide clear, concise definitions for each of these keywords in the context of "${title}".
        Keep each definition to 1-2 sentences maximum (under 50 words).
        Make sure the definitions are relevant to the subject matter of "${title}".
        Format your response as a JSON array where each object has "keyword" and "definition" fields.

        Subject: ${title}
        Keywords: ${keywords.join(', ')}

        Respond only with valid JSON, no additional text.`;

        const responseText = await this.callClaude(prompt, 2000, operation);
        const parsedResponse = this.parseJsonResponse<any[]>(responseText, operation);
        const validatedArray = this.validateArray<any>(parsedResponse, operation);
        
        return this.validateKeywordDefinitions(validatedArray, operation);

      } catch (error) {
        throw new ClaudeApiError(operation, error);
      }
  }

  async generateQuestionAnswers(questions: string[], keywords: string[], title: string): Promise<QuestionAnswer[]> {
    const operation = 'question answering';
    
    try {
      if (!questions?.length) {
        throw new ClaudeApiError(operation, new Error('No questions provided'));
      }
      this.validateInputs(keywords, title, operation);

      const prompt = `Please provide detailed answers to these questions about "${title}".
      Keep each answer to 2-3 sentences maximum (under 100 words).
      Use the provided keywords as context when relevant.
      Format your response as a JSON array where each object has "question" and "answer" fields.

      Subject: ${title}
      Keywords for context: ${keywords.join(', ')}

      Questions:
      ${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

      Respond only with valid JSON, no additional text.`;

      const responseText = await this.callClaude(prompt, 3500, operation);
      const parsedResponse = this.parseJsonResponse<any[]>(responseText, operation);
      const validatedArray = this.validateArray<any>(parsedResponse, operation);
      
      return this.validateQuestionAnswers(validatedArray, operation);

    } catch (error) {
      throw new ClaudeApiError(operation, error);
    }
  }


async generateQuizQuestions(
  keywords: string[],
  title: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<QuizQuestion[]> {
    const operation = 'quiz generation';
    
    try {
      this.validateInputs(keywords, title, operation);
      
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        throw new ClaudeApiError(operation, new Error(`Invalid difficulty level: ${difficulty}`));
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

      const responseText = await this.callClaude(prompt, 4000, operation);
      const parsedResponse = this.parseJsonResponse<any[]>(responseText, operation);
      const validatedArray = this.validateArray<any>(parsedResponse, operation);
      
      return this.validateQuizQuestions(validatedArray, operation);

    } catch (error) {
        throw new ClaudeApiError(operation, error);
      }
  }
}