import { vectorService } from './vector.service';
import { claudeClient } from '../lib/claude-client';
import { RAGOperationError } from '@liranmazor/common';

export class RAGService {
  /**
   * Main RAG pipeline - coordinates vector search + Claude generation
   */
  async generateAnswer(userQuery: string, userId: string): Promise<string> {
    try {
      // 1. RETRIEVAL: Search for relevant learning data
      const vectorResults = await vectorService.searchLearningEvents(userQuery, userId, undefined, 5);
      
      // 2. GENERATION: Generate intelligent response using Claude
      const answer = await claudeClient.generateRAGResponse(userQuery, vectorResults, userId);
      
      return answer;
      
    } catch (error) {
      throw new RAGOperationError('generate answer', error);
    }
  }

  /**
   * Get personalized learning recommendations
   */
  async getPersonalizedRecommendations(userId: string): Promise<string> {
    try {
      const query = "learning struggles recommendations improvement areas study focus";
      return await this.generateAnswer(query, userId);
    } catch (error) {
      throw new RAGOperationError('get personalized recommendations', error);
    }
  }

  /**
   * Compare with peer performance
   */
  async getPeerComparison(userId: string): Promise<string> {
    try {
      console.log(`👥 [RAG] Getting peer comparison for user ${userId}`);
      
      const vectorResults = await vectorService.searchPeerLearningEvents(
        "similar learning patterns performance struggles quiz code", 
        userId,
        undefined,
        5
      );
      
      return await claudeClient.generateRAGResponse(
        "How does my performance compare to similar students? What can I learn from others?", 
        vectorResults, 
        userId
      );
      
    } catch (error) {
      throw new RAGOperationError('get peer comparison', error);
    }
  }

  /**
   * Get coding-specific recommendations
   */
  async getCodingRecommendations(userId: string): Promise<string> {
    try {
      const query = "coding problems algorithm struggles programming challenges code quality";
      console.log(`💻 [RAG] Getting coding recommendations for user ${userId}`);
      
      const vectorResults = await vectorService.searchLearningEvents(
        query, 
        userId, 
        'code_analysis', 
        5
      );
      
      return await claudeClient.generateRAGResponse(
        "What coding areas should I focus on improving? What programming concepts do I need to practice?",
        vectorResults,
        userId
      );
    } catch (error) {
      throw new RAGOperationError('get coding recommendations', error);
    }
  }

  /**
   * Get quiz performance insights
   */
  async getQuizInsights(userId: string): Promise<string> {
    try {
      const query = "quiz performance worksheet completion scores struggling topics";
      console.log(`📝 [RAG] Getting quiz insights for user ${userId}`);
      
      const vectorResults = await vectorService.searchLearningEvents(
        query, 
        userId, 
        'quiz_completion',
        5
      );
      
      return await claudeClient.generateRAGResponse(
        "How am I performing on quizzes? Which worksheet topics do I need to review?",
        vectorResults,
        userId
      );
    } catch (error) {
      throw new RAGOperationError('get quiz insights', error);
    }
  }
}

export const ragService = new RAGService();