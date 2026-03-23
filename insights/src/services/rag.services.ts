import { RAGOperationError } from "@liranmazor/common";
import { claudeClient } from "../lib/claude-client";
import { vectorService } from "./vector.service";
import { confidenceService } from "./confidence.service";
import { ConfidenceMetrics } from "../types/types";
import { githubService } from './github.service';

export class RAGService {
  
  async generateAnswer(
    userQuery: string, 
    userId: string, 
  ): Promise<string> {
    try {

      // STEP 1: Check if query needs GitHub integration
      if (userQuery.toLowerCase().includes("github")) {
        console.log(`🐙 GitHub integration triggered for query: "${userQuery}"`);
        return await githubService.searchForLearningContent(userQuery);
      }

      const limit = 8;
      
      // STEP 3: RETRIEVAL - Get user's learning data
      console.log(`🔍 Searching for user data: userId="${userId}", query="${userQuery}"`);
      const userResults = await vectorService.searchLearningEvents(
        userQuery, 
        { userId },
        limit
      );
      
      console.log(`📊 Raw search results: ${userResults?.documents?.[0]?.length || 0} documents found`);
      
      // STEP 4: Check relevance scores and filter
      const relevantUserResults = vectorService.filterByRelevance(userResults, 0.1);
      console.log(`✅ After relevance filtering: ${relevantUserResults?.documents?.[0]?.length || 0} documents remain`);
      

      // STEP 5: CONFIDENCE ANALYSIS
      const confidence = confidenceService.calculateConfidence(
        userQuery,
        relevantUserResults,
      );
      
      console.log(`🎯 Confidence Analysis: ${confidence.overall}% overall (D:${confidence.dataQuality}% R:${confidence.relevance}% F:${confidence.recency}% C:${confidence.completeness}%)`);
      
      const confidenceLevel = confidenceService.getConfidenceLevel(confidence.overall);
      
      // STEP 6: Handle low confidence cases
      if (confidenceLevel === 'reject') {
        return this.generateLowConfidenceResponse(userQuery, confidence);
      }
      
      // STEP 7: Check if we have enough relevant data (more lenient with confidence)
      if (!this.hasRelevantData(relevantUserResults)) {
        return this.generateNoDataResponse(userQuery);
      }
      
      // STEP 8: GENERATION - Generate confidence-aware response using Claude
      const answer = await claudeClient.generateConfidenceAwareRAGResponse(
        userQuery, 
        relevantUserResults, 
        userId,
        confidence,
      );
      
      return answer;
      
    } catch (error) {
      throw new RAGOperationError('generate answer', error);
    }
  }

  /**
   * Generate response for low confidence situations
   */
  private generateLowConfidenceResponse(query: string, confidence: ConfidenceMetrics): string {
    const prefix = confidenceService.generateConfidencePrefix(confidence, query);
    const suffix = confidenceService.generateConfidenceSuffix(confidence);
    
    const baseResponse = `I'd love to help with "${query}", but I need more learning data to provide accurate insights.`;
    
    return `${prefix}\n\n${baseResponse}${suffix}`;
  }

  /**
   * Check if we have relevant learning data for the query
   */
  private hasRelevantData(userResults: any): boolean {
    const hasUserData = userResults?.documents?.[0]?.length > 0;
    
    return hasUserData;
  }

  /**
   * Generate response when no relevant learning data is found
   */
  private generateNoDataResponse(query: string): string {
    return `I understand you're asking about "${query}", but I don't have enough relevant learning data to provide specific insights on this topic.

To help you better, I'd need information from your:
- Recent quiz completions and scores
- Coding problem attempts and analyses  
- Worksheet creation and study activities

You can start building your learning profile by:
- Taking quizzes on your worksheets
- Attempting coding challenges
- Creating new study materials

Once you have more learning activity, I'll be able to provide personalized insights and recommendations! Is there anything specific you'd like to work on?`;
  }

}

export const ragService = new RAGService();
