import { Collection, ChromaClient } from 'chromadb';
import { VectorOperationError } from '@liranmazor/common';
import { OpenAIEmbeddingFunction } from '../lib/openai-embedding';
import { LearningEventSearchResult, SearchFilters } from '../types/types';

export class VectorService {
  private client?: ChromaClient;
  private readonly COLLECTION_NAME = 'learning_events';
  private collection: Collection | null = null;
  private embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    this.embeddingFunction = new OpenAIEmbeddingFunction();
  }

  async initialize() {
    try {
      this.client = new ChromaClient({
        host: process.env.CHROMA_HOST!,
        port: parseInt(process.env.CHROMA_PORT!)
      });
      
      console.log('Connected to ChromaDB')
      
      this.collection = await this.client.getOrCreateCollection({
        name: this.COLLECTION_NAME,
        embeddingFunction: this.embeddingFunction,
        metadata: { 
          description: 'Unified collection for all learning events with semantic embeddings',
          version: '2.0',
          strategy: 'raw_event_storage',
          embeddingType: 'openai'
        }
      });
      
      console.log('Vector collection initialized');
    } catch (error) {
      console.error('❌ Vector service initialization failed:', error);
      throw new VectorOperationError('vector service initialization', error);
    }
  }

  /**
   * Enhanced search with better query preprocessing and relevance scoring
   */
  async searchLearningEvents(
    query: string, 
    filters: SearchFilters = {},
    limit: number = 10
  ): Promise<LearningEventSearchResult> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new VectorOperationError('search learning events', new Error('Query must be a non-empty string'));
    }
  
    if (limit <= 0 || limit > 50) {
      throw new VectorOperationError('search learning events', new Error('Limit must be between 1 and 50'));
    }
  
    if (!this.collection) {
      throw new VectorOperationError('search learning events', new Error('Vector service not initialized'));
    }
  
    try {
      // Preprocess query for better semantic search
      const processedQuery = this.preprocessQuery(query);
      const whereClause = this.buildWhereClause(filters);
      
      console.log(`🔍 Searching for: "${query}" (processed: "${processedQuery}")`);
      if (whereClause) {
        console.log(`📋 Filters applied:`, whereClause);
      }
      
      const results = await this.collection.query({
        queryTexts: [processedQuery],
        nResults: limit,
        ...(whereClause && { where: whereClause }),
        include: ['documents', 'metadatas', 'distances']
      });

      // Log search details for debugging
      if (results.distances && results.distances[0]) {
        // ChromaDB distances can be negative with some distance metrics
        // We need to handle this properly
        const similarities = results.distances[0].map(d => {
          if (d !== null) {
            // For cosine distance: similarity = 1 - distance
            // But if distance > 1, similarity becomes negative
            // We should clamp it to a reasonable range
            const similarity = Math.max(0, Math.min(100, (1 - d) * 100));
            return Math.round(similarity);
          }
          return 0;
        });
        console.log(`📊 Search results: ${results.documents?.[0]?.length || 0} found, similarities: [${similarities.join(', ')}]%`);
        console.log(`📊 Raw distances: [${results.distances[0].map(d => d?.toFixed(2)).join(', ')}]`);
      } else {
        console.log(`📊 Search results: ${results.documents?.[0]?.length || 0} found (no distance scores)`);
      }
  
      return results as LearningEventSearchResult;
    } catch (error) {
      console.error('❌ Vector search failed:', error);
      throw new VectorOperationError('search learning events', error);
    }
  }

  /**
   * Filter search results by similarity threshold
   */
  filterByRelevance(results: LearningEventSearchResult, threshold: number): LearningEventSearchResult {
    if (!results?.distances?.[0] || !results?.documents?.[0]) {
      return results;
    }

    const distances = results.distances[0];
    const documents = results.documents[0];
    const metadatas = results.metadatas?.[0] || [];
    const ids = results.ids?.[0] || [];
    
    // Find indices that meet similarity threshold
    const relevantIndices: number[] = [];
    
    distances.forEach((distance, index) => {
      if (distance !== null) {
        // Handle negative distances properly
        // ChromaDB with certain embedding models can return distances > 1
        // We'll use a more flexible similarity calculation
        let similarity: number;
        
        if (distance <= 1) {
          // Standard cosine similarity: similarity = 1 - distance
          similarity = 1 - distance;
        } else {
          // For distances > 1, use inverse relationship
          // This handles cases where embeddings aren't normalized
          similarity = 1 / (1 + Math.abs(distance));
        }
        
        // Ensure similarity is between 0 and 1
        similarity = Math.max(0, Math.min(1, similarity));
        
        console.log(`📊 Index ${index}: distance=${distance.toFixed(3)}, similarity=${(similarity * 100).toFixed(1)}%, threshold=${(threshold * 100)}%`);
        
        if (similarity >= threshold) {
          relevantIndices.push(index);
        }
      }
    });

    // If no results meet threshold, return empty structure
    if (relevantIndices.length === 0) {
      console.log(`🚫 No results meet similarity threshold of ${Math.round(threshold * 100)}%`);
      return {
        documents: [[]],
        metadatas: [[]],
        distances: [[]],
        ids: [[]]
      };
    }

    console.log(`✅ ${relevantIndices.length}/${distances.length} results meet similarity threshold of ${Math.round(threshold * 100)}%`);

    // Filter all arrays by relevant indices
    return {
      documents: [relevantIndices.map(i => documents[i])],
      metadatas: [relevantIndices.map(i => metadatas[i])],
      distances: [relevantIndices.map(i => distances[i])],
      ids: [relevantIndices.map(i => ids[i])]
    };
  }

  /**
   * Preprocess query to improve semantic search quality
   */
  private preprocessQuery(query: string): string {
    const trimmed = query.trim().toLowerCase();
    
    // Expand common abbreviations and synonyms for better matching
    const expansions: { [key: string]: string } = {
      'js': 'javascript',
      'py': 'python',
      'css': 'cascading style sheets',
      'html': 'hypertext markup language',
      'db': 'database',
      'api': 'application programming interface',
      'ui': 'user interface',
      'ux': 'user experience',
      'ml': 'machine learning',
      'ai': 'artificial intelligence',
      'coding': 'programming coding software development',
      'quiz': 'quiz test assessment evaluation',
      'worksheet': 'worksheet study material learning content',
      'struggling': 'difficulty challenges problems issues',
      'help': 'assistance guidance support learning help',
      'progress': 'progress improvement advancement learning development',
      'performance': 'performance results scores achievements',
    };

    let expandedQuery = trimmed;
    
    // Apply expansions
    Object.entries(expansions).forEach(([abbrev, expansion]) => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      expandedQuery = expandedQuery.replace(regex, expansion);
    });

    // Add learning context keywords to improve relevance
    const learningKeywords = [
      'learning', 'education', 'study', 'academic', 'student', 'progress'
    ];
    
    // Check if query already contains learning-related terms
    const hasLearningContext = learningKeywords.some(keyword => 
      expandedQuery.includes(keyword)
    );
    
    // If no learning context, add relevant terms based on query content
    if (!hasLearningContext) {
      if (expandedQuery.includes('code') || expandedQuery.includes('program')) {
        expandedQuery += ' programming learning development';
      } else if (expandedQuery.includes('quiz') || expandedQuery.includes('test')) {
        expandedQuery += ' assessment learning evaluation';
      } else if (expandedQuery.includes('worksheet')) {
        expandedQuery += ' study learning material';
      } else {
        expandedQuery += ' learning education';
      }
    }

    return expandedQuery;
  }

  private buildWhereClause(filters: SearchFilters): Record<string, any> | undefined {
    const whereClause: Record<string, any> = {};
    
    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.excludeUserId) {
      whereClause.userId = { $ne: filters.excludeUserId };
    }

    if (filters.eventType) {
      whereClause.eventType = filters.eventType;
    }

    if (filters.dateRange) {
      whereClause.timestamp = {
        $gte: filters.dateRange.from,
        $lte: filters.dateRange.to
      };
    }

    return Object.keys(whereClause).length > 0 ? whereClause : undefined;
  }

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

    try {
      const completedAtISO = eventData.completedAt instanceof Date 
        ? eventData.completedAt.toISOString() 
        : eventData.completedAt;

      const performanceLevel = eventData.score >= 90 ? 'excellent' : 
                              eventData.score >= 70 ? 'good' : 
                              eventData.score >= 50 ? 'average' : 'struggling';

      const semanticText = `Student quiz completion performance assessment: User successfully completed comprehensive "${eventData.worksheetTitle}" educational worksheet quiz at ${eventData.difficulty.toLowerCase()} difficulty level on ${new Date(completedAtISO).toLocaleDateString()}. Academic performance results: achieved ${eventData.score} out of 100 points, demonstrating ${performanceLevel} understanding and mastery. Subject matter expertise area: ${eventData.worksheetTitle} studies. Learning assessment shows ${performanceLevel} comprehension level in this educational domain. Quiz evaluation completed at ${eventData.difficulty.toLowerCase()} academic standard.`;

      const id = `quiz_${eventData.userId}_${eventData.worksheetId}_${Date.now()}`;
      
      await this.collection.add({
        ids: [id],
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

  async storeCodeAnalysis(eventData: {
    userId: string;
    problemId: string;
    strugglingAreas: Array<{ category: string; intensity: string; description: string }>;
    metrics: {
      codeQuality: number;
      algorithmCorrectness: number;
      syntaxAccuracy: number;
      edgeCaseHandling: number;
      readability: number;
    };
    context: {
      problemDifficulty: string;
      languageFeatures: string[];
      codeLength: number;
    };
    analyzedAt: string;
  }): Promise<void> {
    if (!this.collection) {
      throw new VectorOperationError('store code analysis', new Error('Vector service not initialized'));
    }

    try {
      const primaryStruggle = eventData.strugglingAreas[0];
      const strugglesText = eventData.strugglingAreas
        .map(s => `${s.category} (${s.intensity} difficulty): ${s.description}`)
        .join(', ');

      const semanticText = `Programming code analysis and evaluation: User attempted coding problem "${eventData.problemId}" at ${eventData.context.problemDifficulty} difficulty level on ${new Date(eventData.analyzedAt).toLocaleDateString()}. Comprehensive code quality assessment results: overall code quality scored ${eventData.metrics.codeQuality}/100 points, algorithm correctness achieved ${eventData.metrics.algorithmCorrectness}/100, syntax accuracy measured ${eventData.metrics.syntaxAccuracy}/100, edge case handling scored ${eventData.metrics.edgeCaseHandling}/100, code readability rated ${eventData.metrics.readability}/100. Primary programming challenge areas identified: ${strugglesText}. Technical implementation details: utilized ${eventData.context.languageFeatures.join(', ')} programming language features, code implementation totaled ${eventData.context.codeLength} characters in length. Programming skill assessment shows specific learning needs in ${primaryStruggle?.category || 'general programming'} with ${primaryStruggle?.intensity || 'moderate'} intensity difficulty level.`;

      const id = `code_${eventData.userId}_${eventData.problemId}_${Date.now()}`;

      await this.collection.add({
        ids: [id],
        documents: [semanticText],
        metadatas: [{
          eventType: 'code_analysis',
          userId: eventData.userId,
          problemId: eventData.problemId,
          primaryStruggle: primaryStruggle?.category || 'unknown',
          primaryIntensity: primaryStruggle?.intensity || 'unknown',
          codeQuality: eventData.metrics.codeQuality,
          algorithmCorrectness: eventData.metrics.algorithmCorrectness,
          syntaxAccuracy: eventData.metrics.syntaxAccuracy,
          edgeCaseHandling: eventData.metrics.edgeCaseHandling,
          readability: eventData.metrics.readability,
          problemDifficulty: eventData.context.problemDifficulty,
          languageFeatures: eventData.context.languageFeatures.join(','),
          codeLength: eventData.context.codeLength,
          analyzedAt: eventData.analyzedAt,
          timestamp: new Date().toISOString(),
          fullAnalytics: JSON.stringify(eventData)
        }]
      });
      
    } catch (error) {
      throw new VectorOperationError('store code analysis', error);
    }
  }

  async storeWorksheetCreationEvent(eventData: {
    id: string;
    title: string;
    userId: string;
    createdAt: Date | string;
  }): Promise<void> {
    if (!this.collection) {
      throw new VectorOperationError('store worksheet creation', new Error('Vector service not initialized'));
    }

    try {
      const createdAtISO = eventData.createdAt instanceof Date 
        ? eventData.createdAt.toISOString() 
        : eventData.createdAt;

      const semanticText = `Educational content creation and curriculum development: User initiated and created comprehensive new educational study worksheet titled "${eventData.title}" on ${new Date(createdAtISO).toLocaleDateString()}. Learning material development project for academic study content with structured multiple difficulty assessment levels available including beginner foundation level, intermediate progression level, and advanced mastery level educational evaluations. Educational content creation demonstrates student engagement in active learning material preparation and curriculum development activities. Subject area focus: ${eventData.title} academic domain. Study material development shows proactive learning approach and educational content preparation initiatives.`;

      const id = `worksheet_${eventData.userId}_${eventData.id}_${Date.now()}`;

      await this.collection.add({
        ids: [id],
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
}

export const vectorService = new VectorService();