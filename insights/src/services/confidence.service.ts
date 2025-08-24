import { ConfidenceMetrics, ConfidenceThresholds } from "../types/types";

export class ConfidenceService {
  private thresholds: ConfidenceThresholds = {
    high: 80,
    medium: 60,
    low: 40,
    reject: 40
  };

  /**
   * Calculate comprehensive confidence metrics for a RAG response
   */
  calculateConfidence(
    userQuery: string,
    userResults: any,
    peerResults?: any
  ): ConfidenceMetrics {
    const dataQuality = this.assessDataQuality(userResults, peerResults);
    const relevance = this.assessRelevance(userResults);
    const recency = this.assessRecency(userResults);
    const completeness = this.assessCompleteness(userResults);
    const consistency = this.assessConsistency(userResults);

    // Weighted overall confidence calculation
    const overall = Math.round(
      dataQuality * 0.25 +      // 25% - quality of data
      relevance * 0.30 +        // 30% - relevance to query  
      recency * 0.15 +          // 15% - freshness of data
      completeness * 0.20 +     // 20% - data completeness
      consistency * 0.10        // 10% - pattern consistency
    );

    return {
      overall,
      dataQuality,
      relevance,
      recency,
      completeness,
      consistency
    };
  }

  /**
   * Assess data quality based on volume and variety
   */
  private assessDataQuality(userResults: any, peerResults?: any): number {
    const userDocs = userResults?.documents?.[0] || [];
    const userMetadata = userResults?.metadatas?.[0] || [];
    
    if (userDocs.length === 0) return 0;

    // Volume score (0-40 points)
    let volumeScore = Math.min(40, userDocs.length * 8); // 8 points per document, max 40

    // Variety score (0-30 points) 
    const eventTypes = new Set(userMetadata.map((m: any) => m?.eventType).filter(Boolean));
    let varietyScore = Math.min(30, eventTypes.size * 10); // 10 points per type, max 30

    // Peer data bonus (0-15 points)
    const peerDocs = peerResults?.documents?.[0] || [];
    let peerBonus = Math.min(15, peerDocs.length * 3); // 3 points per peer doc, max 15

    // Score quality bonus (0-15 points)
    const scoresPresent = userMetadata.filter((m: any) => typeof m?.score === 'number').length;
    let scoreBonus = Math.min(15, scoresPresent * 5); // 5 points per score, max 15

    return Math.min(100, volumeScore + varietyScore + peerBonus + scoreBonus);
  }

  /**
   * Assess relevance based on similarity scores
   */
  private assessRelevance(userResults: any): number {
    const distances = userResults?.distances?.[0] || [];
    
    if (distances.length === 0) return 0;

    // Calculate average similarity
    const similarities = distances.map((d: number | null) => {
      if (d === null || d === undefined) return 0;
      return Math.max(0, Math.min(1, d <= 1 ? 1 - d : 1 / (1 + Math.abs(d))));
    });

    const avgSimilarity = similarities.reduce((a: number, b: number) => a + b, 0) / similarities.length;
    const maxSimilarity = Math.max(...similarities);

    // Score based on both average and best similarity
    return Math.round((avgSimilarity * 0.6 + maxSimilarity * 0.4) * 100);
  }

  /**
   * Assess recency of data
   */
  private assessRecency(userResults: any): number {
    const metadatas = userResults?.metadatas?.[0] || [];
    
    if (metadatas.length === 0) return 0;

    const now = new Date().getTime();
    const dayInMs = 24 * 60 * 60 * 1000;

    let totalRecencyScore = 0;
    let validTimestamps = 0;

    for (const metadata of metadatas) {
      const timestamp = metadata?.timestamp || metadata?.completedAt || metadata?.analyzedAt || metadata?.createdAt;
      
      if (timestamp) {
        const eventTime = new Date(timestamp).getTime();
        const ageInDays = (now - eventTime) / dayInMs;
        
        // Scoring: 100 for today, decreasing over time
        let recencyScore: number;
        if (ageInDays <= 1) recencyScore = 100;
        else if (ageInDays <= 7) recencyScore = 90 - (ageInDays - 1) * 5; // 90-60
        else if (ageInDays <= 30) recencyScore = 60 - (ageInDays - 7) * 2; // 60-20
        else recencyScore = Math.max(0, 20 - (ageInDays - 30) * 0.5); // 20-0

        totalRecencyScore += recencyScore;
        validTimestamps++;
      }
    }

    return validTimestamps > 0 ? Math.round(totalRecencyScore / validTimestamps) : 50;
  }

  /**
   * Assess completeness of learning profile
   */
  private assessCompleteness(userResults: any): number {
    const metadatas = userResults?.metadatas?.[0] || [];
    
    if (metadatas.length === 0) return 0;

    // Check for different types of learning activities
    const hasQuizData = metadatas.some((m: any) => m?.eventType === 'quiz_completion');
    const hasCodeData = metadatas.some((m: any) => m?.eventType === 'code_analysis');
    const hasWorksheetData = metadatas.some((m: any) => m?.eventType === 'worksheet_creation');

    // Check for performance metrics
    const hasScores = metadatas.some((m: any) => typeof m?.score === 'number');
    const hasStruggles = metadatas.some((m: any) => m?.primaryStruggle);
    const hasDifficulties = metadatas.some((m: any) => m?.difficulty || m?.problemDifficulty);

    // Scoring
    let completenessScore = 0;
    if (hasQuizData) completenessScore += 20;
    if (hasCodeData) completenessScore += 20;
    if (hasWorksheetData) completenessScore += 15;
    if (hasScores) completenessScore += 15;
    if (hasStruggles) completenessScore += 15;
    if (hasDifficulties) completenessScore += 15;

    return Math.min(100, completenessScore);
  }

  /**
   * Assess consistency of performance patterns
   */
  private assessConsistency(userResults: any): number {
    const metadatas = userResults?.metadatas?.[0] || [];
    
    if (metadatas.length === 0) return 0;

    // Get scores for consistency analysis
    const scores = metadatas
      .map((m: any) => typeof m?.score === 'number' ? m.score : null)
      .filter((score: number | null): score is number => score !== null);

    if (scores.length < 2) return 50; // Not enough data for consistency

    // Calculate variance in scores
    const mean = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc: number, score: number) => acc + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    // Convert to 0-100 scale (assume std dev of 0-30 maps to 100-0 consistency)
    const consistencyScore = Math.max(0, 100 - (stdDev * 3.33));

    return Math.round(consistencyScore);
  }

  /**
   * Get confidence level category
   */
  getConfidenceLevel(overall: number): 'high' | 'medium' | 'low' | 'reject' {
    if (overall >= this.thresholds.high) return 'high';
    if (overall >= this.thresholds.medium) return 'medium';
    if (overall >= this.thresholds.low) return 'low';
    return 'reject';
  }

  /**
   * Generate confidence-aware response prefix
   */
  generateConfidencePrefix(metrics: ConfidenceMetrics, query: string): string {
    const level = this.getConfidenceLevel(metrics.overall);

    switch (level) {
      case 'high':
        return `Based on your comprehensive learning data (${metrics.overall}% confidence), I can provide detailed insights:`;

      case 'medium':
        return `Based on your available learning data (${metrics.overall}% confidence), here's what I can tell you, though some areas could benefit from more activity:`;

      case 'low':
        return `I have limited data about your learning progress (${metrics.overall}% confidence), but here's what I can gather so far:`;

      case 'reject':
        return `I don't have enough reliable data to answer "${query}" accurately (${metrics.overall}% confidence). Let me suggest ways to build your learning profile:`;

      default:
        return '';
    }
  }

  /**
   * Generate confidence-aware response suffix with actionable suggestions
   */
  generateConfidenceSuffix(metrics: ConfidenceMetrics): string {
    const level = this.getConfidenceLevel(metrics.overall);
    const suggestions = [];

    // Identify specific improvement areas
    if (metrics.dataQuality < 70) {
      suggestions.push("• Complete more learning activities (quizzes, coding problems, worksheets) to improve analysis accuracy");
    }
    
    if (metrics.relevance < 60) {
      suggestions.push("• Try more specific questions about your learning areas for better-targeted insights");
    }
    
    if (metrics.recency < 50) {
      suggestions.push("• Recent activity would help me provide more current recommendations");
    }
    
    if (metrics.completeness < 60) {
      suggestions.push("• Try different types of learning activities for a more complete picture");
    }

    switch (level) {
      case 'high':
        return suggestions.length > 0 
          ? `\n\n**To maintain high-quality insights:** ${suggestions.slice(0, 1).join('')}`
          : '';

      case 'medium':
        return suggestions.length > 0 
          ? `\n\n**To improve future insights:**\n${suggestions.slice(0, 2).join('\n')}`
          : '';

      case 'low':
        return suggestions.length > 0 
          ? `\n\n**To get better recommendations:**\n${suggestions.join('\n')}`
          : '';

      case 'reject':
        return `\n\n**Quick ways to build your learning profile:**\n${suggestions.join('\n')}\n\nOnce you have more activity, I'll be able to provide much more accurate and personalized insights!`;

      default:
        return '';
    }
  }
}

export const confidenceService = new ConfidenceService();