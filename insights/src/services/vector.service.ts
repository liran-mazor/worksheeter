import { vectorClient } from '../lib/vector-client';
import { Collection } from 'chromadb';
import { VectorOperationError } from '@liranmazor/common';
import { OpenAIEmbeddingFunction } from '../lib/openai-embedding';

export class VectorService {
  private readonly COLLECTION_NAME = 'learning_events';
  private collection: Collection | null = null;
  private embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    this.embeddingFunction = new OpenAIEmbeddingFunction();
  }

  async initialize() {
    try {
      const chroma = vectorClient.chroma;
      
      this.collection = await chroma.getOrCreateCollection({
        name: this.COLLECTION_NAME,
        embeddingFunction: this.embeddingFunction,
        metadata: { 
          description: 'Unified collection for all learning events with semantic embeddings',
          version: '2.0',
          strategy: 'raw_event_storage',
          embeddingType: this.embeddingFunction instanceof OpenAIEmbeddingFunction ? 'openai' : 'simple'
        }
      });
    } catch (error) {
      throw new VectorOperationError('vector service initialization', error);
    }
  }

  /**
   * Store quiz completion event as semantic vector
   */
  async storeQuizCompletionEvent(eventData: {
   userId: string;
   worksheetId: string;
   worksheetTitle: string;
   difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
   score: number;
   completedAt: Date | string;
 }): Promise<void> {
   if (!this.collection) {
     throw new VectorOperationError('store quiz completion', new Error('Vector service not initialized'));
   }

   const completedAtISO = eventData.completedAt instanceof Date 
     ? eventData.completedAt.toISOString() 
     : eventData.completedAt;

   const performanceLevel = eventData.score >= 90 ? 'excellent' : 
                           eventData.score >= 70 ? 'good' : 
                           eventData.score >= 50 ? 'average' : 'struggling';

   // Enhanced semantic text for better OpenAI embedding quality
   const semanticText = `Student quiz completion: User completed "${eventData.worksheetTitle}" worksheet quiz at ${eventData.difficulty.toLowerCase()} difficulty level. Performance: scored ${eventData.score} out of 100 points, showing ${performanceLevel} understanding. Subject matter: ${eventData.worksheetTitle}. Learning assessment completed on ${completedAtISO}.`;

   try {
     await this.collection.add({
       ids: [`quiz_${eventData.userId}_${eventData.worksheetId}_${eventData.difficulty}_${Date.now()}`],
       documents: [semanticText],
       metadatas: [{
         eventType: 'quiz_completion',
         userId: eventData.userId,
         worksheetId: eventData.worksheetId,
         worksheetTitle: eventData.worksheetTitle,
         difficulty: eventData.difficulty,
         score: eventData.score,
         performanceLevel: performanceLevel,
         completedAt: completedAtISO,
         timestamp: new Date().toISOString()
       }]
     });

   } catch (error) {
     throw new VectorOperationError('store quiz completion', error);
   }
 }

 /**
  * Store code analysis event as semantic vector
  */
 async storeCodeAnalysisEvent(eventData: {
   userId: string;
   problemId: string;
   analytics: {
     strugglingAreas: Array<{
       category: string;
       intensity: string;
       evidence: string;
       confidence: number;
     }>;
     metrics: {
       codeQuality: number;
       algorithmCorrectness: number;
       syntaxAccuracy: number;
       edgeCaseHandling: number;
       readability: number;
     };
     context: {
       problemDifficulty: string;
       codeLength: number;
       languageFeatures: string[];
     };
   };
   analyzedAt: string;
 }): Promise<void> {
   if (!this.collection) {
     throw new VectorOperationError('store code analysis', new Error('Vector service not initialized'));
   }

   const { analytics } = eventData;
   const primaryStruggle = analytics.strugglingAreas[0];
   const strugglesText = analytics.strugglingAreas
     .map(area => `${area.category} (${area.intensity} severity)`)
     .join(', ');

   // Enhanced semantic text for better OpenAI embedding quality
   const semanticText = `Coding assessment: Student submitted code solution for "${eventData.problemId}" programming problem with ${analytics.context.problemDifficulty} difficulty level. Code quality metrics: overall quality ${analytics.metrics.codeQuality}/100, algorithm correctness ${analytics.metrics.algorithmCorrectness}/100, syntax accuracy ${analytics.metrics.syntaxAccuracy}/100. Main learning challenges identified: ${strugglesText}. Programming concepts used: ${analytics.context.languageFeatures.join(', ')}. Code implementation was ${analytics.context.codeLength} characters in length.`;

   try {
     await this.collection.add({
       ids: [`code_${eventData.userId}_${eventData.problemId}_${Date.now()}`],
       documents: [semanticText],
       metadatas: [{
         eventType: 'code_analysis',
         userId: eventData.userId,
         problemId: eventData.problemId,
         primaryStruggle: primaryStruggle?.category || 'unknown',
         primaryIntensity: primaryStruggle?.intensity || 'unknown',
         codeQuality: analytics.metrics.codeQuality,
         algorithmCorrectness: analytics.metrics.algorithmCorrectness,
         problemDifficulty: analytics.context.problemDifficulty,
         analyzedAt: eventData.analyzedAt,
         timestamp: new Date().toISOString(),
         fullAnalytics: JSON.stringify(analytics)
       }]
     });

   } catch (error) {
     throw new VectorOperationError('store code analysis', error);
   }
 }

 /**
  * Store worksheet creation event as semantic vector
  */
 async storeWorksheetCreationEvent(eventData: {
   id: string;
   title: string;
   userId: string;
   createdAt: Date | string;
 }): Promise<void> {
   if (!this.collection) {
     throw new VectorOperationError('store worksheet creation', new Error('Vector service not initialized'));
   }

   const createdAtISO = eventData.createdAt instanceof Date 
     ? eventData.createdAt.toISOString() 
     : eventData.createdAt;

   // Enhanced semantic text for better OpenAI embedding quality
   const semanticText = `Content creation: User created new educational worksheet titled "${eventData.title}". Learning material development for study content with multiple difficulty levels available: beginner, intermediate, and advanced assessments. Educational content created on ${createdAtISO}.`;

   try {
     await this.collection.add({
       ids: [`worksheet_${eventData.userId}_${eventData.id}_${Date.now()}`],
       documents: [semanticText],
       metadatas: [{
         eventType: 'worksheet_creation',
         userId: eventData.userId,
         worksheetId: eventData.id,
         worksheetTitle: eventData.title,
         createdAt: createdAtISO,
         timestamp: new Date().toISOString()
       }]
     });

   } catch (error) {
     throw new VectorOperationError('store worksheet creation', error);
   }
 }

  /**
   * Search learning events using semantic similarity
   */
  async searchLearningEvents(
    query: string, 
    userId?: string, 
    eventType?: 'quiz_completion' | 'code_analysis' | 'worksheet_creation',
    limit: number = 10
  ) {
    if (!this.collection) {
      throw new VectorOperationError('search learning events', new Error('Vector service not initialized'));
    }

    try {
      const whereClause: any = {};
      
      if (eventType) {
        whereClause.eventType = eventType;
      }
      
      if (userId) {
        whereClause.userId = userId;
      }

      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit,
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined
      });

      return results;
    } catch (error) {
      throw new VectorOperationError('search learning events', error);
    }
  }

  /**
   * Search learning events excluding specific user (for peer comparisons)
   */
  async searchPeerLearningEvents(
    query: string, 
    excludeUserId: string,
    eventType?: 'quiz_completion' | 'code_analysis' | 'worksheet_creation',
    limit: number = 10
  ) {
    if (!this.collection) {
      throw new VectorOperationError('search peer learning events', new Error('Vector service not initialized'));
    }

    try {
      const whereClause: any = {
        userId: { $ne: excludeUserId }
      };
      
      if (eventType) {
        whereClause.eventType = eventType;
      }

      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit,
        where: whereClause
      });

      return results;
    } catch (error) {
      throw new VectorOperationError('search peer learning events', error);
    }
  }

  /**
   * Get collection statistics for monitoring
   */
  async getCollectionStats() {
    if (!this.collection) {
      throw new VectorOperationError('get collection stats', new Error('Vector service not initialized'));
    }

    try {
      const totalCount = await this.collection.count();
      
      return {
        totalEvents: totalCount,
        collectionName: this.COLLECTION_NAME,
        embeddingType: this.embeddingFunction instanceof OpenAIEmbeddingFunction ? 'openai' : 'simple'
      };
    } catch (error) {
      throw new VectorOperationError('get collection statistics', error);
    }
  }
}

export const vectorService = new VectorService();