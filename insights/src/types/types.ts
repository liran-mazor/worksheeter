export interface LearningEventSearchResult {
  ids: string[][];
  distances: number[][];
  metadatas: (Record<string, any> | null)[][];
  documents: (string | null)[][];
}

export interface SearchFilters {
  userId?: string;
  excludeUserId?: string;
  eventType?: 'quiz_completion' | 'code_analysis' | 'worksheet_creation';
  dateRange?: {
    from: string;
    to: string;
  };
  minScore?: number;
  maxScore?: number;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  strugglingArea?: string;
}

export interface Metadata {
  eventType?: string;
  userId?: string;
  worksheetId?: string;
  worksheetTitle?: string | number | boolean;
  difficulty?: string;
  score?: string | number | boolean;
  performanceLevel?: string;
  completedAt?: string;
  timestamp?: string;
  problemId?: string | number | boolean;
  primaryStruggle?: string | number | boolean;
  primaryIntensity?: string;
  codeQuality?: number;
  algorithmCorrectness?: number;
  syntaxAccuracy?: number;
  edgeCaseHandling?: number;
  readability?: number;
  problemDifficulty?: string;
  languageFeatures?: string;
  codeLength?: number;
  analyzedAt?: string;
  createdAt?: string;
  fullAnalytics?: string;
}

export interface LearningAnalytics {
  totalEvents: number;
  recentEvents: Metadata[];
  strugglingAreas: string[];
  strongAreas: string[];
  averagePerformance: number;
  eventTypeBreakdown: {
    quizCompletions: number;
    codeAnalyses: number;
    worksheetCreations: number;
  };
  performanceTrends: {
    improvingAreas: string[];
    decliningAreas: string[];
    stableAreas: string[];
  };
  recommendations: string[];
}

export interface DataQualityAssessment {
  userDataRichness: 'rich' | 'moderate' | 'sparse';
  relevance: 'high' | 'medium' | 'low';
  completeness: 'complete' | 'partial' | 'limited';
  confidence: number; // 0-100
}

export interface RAGContext {
  userContext: string;
  peerContext?: string;
  dataQuality: DataQualityAssessment;
  searchMetrics: {
    totalResults: number;
    averageSimilarity: number;
    filteredResults: number;
  };
}

export interface QueryClassification {
  isLearningRelated: boolean;
  needsPeerData: boolean;
  intent: 'analysis' | 'recommendation' | 'comparison' | 'help' | 'casual' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  suggestedResponseType: 'educational' | 'casual' | 'redirect';
}

export interface VectorSearchOptions {
  includeDistances?: boolean;
  includeMetadata?: boolean;
  includeDocuments?: boolean;
  threshold?: number;
  maxResults?: number;
}

export interface ConfidenceMetrics {
  overall: number;
  dataQuality: number;
  relevance: number;
  recency: number;
  completeness: number;
  consistency: number;
}

export interface ConfidenceThresholds {
  high: number;
  medium: number;
  low: number;
  reject: number;
}