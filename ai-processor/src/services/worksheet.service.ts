import { claudeClient } from '../lib/claude-client';
import { ClaudeApiError } from '@liranmazor/common';
import { KeywordDefinition, QuestionAnswer } from '../types/worksheet';

export class WorksheetService {
  private validateInputs(keywords: string[], title: string, operation: string): void {
    if (!keywords?.length) {
      throw new ClaudeApiError(operation, new Error('No keywords provided'));
    }
    if (!title?.trim()) {
      throw new ClaudeApiError(operation, new Error('No title provided'));
    }
  }

  private validateKeywordDefinitions(definitions: any[], operation: string): KeywordDefinition[] {
    for (const item of definitions) {
      if (!item.keyword || !item.definition) {
        throw new ClaudeApiError(operation, new Error('Invalid keyword definition format'));
      }
    }
    return definitions;
  }

  private validateQuestionAnswers(answers: any[], operation: string): QuestionAnswer[] {
    for (const item of answers) {
      if (!item.question || !item.answer) {
        throw new ClaudeApiError(operation, new Error('Invalid question answer format'));
      }
    }
    return answers;
  }

  async generateKeywordDefinitions(keywords: string[], title: string): Promise<KeywordDefinition[]> {
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

      const responseText = await claudeClient.callClaude(prompt, 2000, operation);
      const parsedResponse = claudeClient.parseJsonResponse<any[]>(responseText, operation);
      
      if (!Array.isArray(parsedResponse)) {
        throw new ClaudeApiError(operation, new Error('Expected JSON array'));
      }
      
      return this.validateKeywordDefinitions(parsedResponse, operation);
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

      const responseText = await claudeClient.callClaude(prompt, 3000, operation);
      const parsedResponse = claudeClient.parseJsonResponse<any[]>(responseText, operation);
      
      if (!Array.isArray(parsedResponse)) {
        throw new ClaudeApiError(operation, new Error('Expected JSON array'));
      }
      
      return this.validateQuestionAnswers(parsedResponse, operation);
    } catch (error) {
      throw new ClaudeApiError(operation, error);
    }
  }
}
export const worksheetService = new WorksheetService();