import { RAGOperationError } from "@liranmazor/common";
import { claudeClient } from "../lib/claude-client";
import { vectorService } from "./vector.service";
import { confidenceAnalyzer } from "./confidence.service";
import { ConfidenceMetrics } from "../types/types";

export class RAGService {
  
  async generateAnswer(
    userQuery: string, 
    userId: string, 
  ): Promise<string> {
    try {
      // STEP 1: Check if query is learning-related using Claude
      const isLearningRelated = await this.isQueryLearningRelated(userQuery);
      
      if (!isLearningRelated) {
        return this.generateCasualResponse(userQuery);
      }

      // STEP 2: Determine if peer comparison is needed
      const needsPeerData = this.detectPeerComparisonIntent(userQuery);
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
      
      let peerResults;
      if (needsPeerData) {
        console.log(`👥 Searching for peer data...`);
        peerResults = await vectorService.searchLearningEvents(
          userQuery, 
          { excludeUserId: userId },
          limit
        );
        peerResults = vectorService.filterByRelevance(peerResults, 0.05);
        console.log(`👥 Peer results after filtering: ${peerResults?.documents?.[0]?.length || 0} documents`);
      }

      // STEP 5: CONFIDENCE ANALYSIS
      const confidence = confidenceAnalyzer.calculateConfidence(
        userQuery,
        relevantUserResults,
        peerResults
      );
      
      console.log(`🎯 Confidence Analysis: ${confidence.overall}% overall (D:${confidence.dataQuality}% R:${confidence.relevance}% F:${confidence.recency}% C:${confidence.completeness}%)`);
      
      const confidenceLevel = confidenceAnalyzer.getConfidenceLevel(confidence.overall);
      
      // STEP 6: Handle low confidence cases
      if (confidenceLevel === 'reject') {
        return this.generateLowConfidenceResponse(userQuery, confidence);
      }
      
      // STEP 7: Check if we have enough relevant data (more lenient with confidence)
      if (!this.hasRelevantData(relevantUserResults, peerResults)) {
        return this.generateNoDataResponse(userQuery);
      }
      
      // STEP 8: GENERATION - Generate confidence-aware response using Claude
      const answer = await claudeClient.generateConfidenceAwareRAGResponse(
        userQuery, 
        relevantUserResults, 
        userId,
        confidence,
        peerResults
      );
      
      return answer;
      
    } catch (error) {
      throw new RAGOperationError('generate answer', error);
    }
  }

  /**
   * Use Claude to determine if query is learning-related
   */
  private async isQueryLearningRelated(query: string): Promise<boolean> {
    try {
      // Fast keyword-based classification
      const learningKeywords = [
        'how am i doing', 'how do i compare', 'progress', 'performance', 'learning',
        'study', 'quiz', 'coding', 'programming', 'worksheet', 'help me', 'teach me',
        'struggling', 'improve', 'better', 'practice', 'challenge', 'understand',
        'explain', 'javascript', 'python', 'algorithm', 'code', 'debug', 'error',
        'score', 'grade', 'assignment', 'homework', 'test', 'exam', 'assessment',
        'recommendation', 'suggest', 'advice', 'guidance', 'mentor', 'tutor',
        'yes', 'yeah', 'sure', 'okay', 'roadmap', 'plan', 'focus', 'skill'
      ];
      
      const lowerQuery = query.toLowerCase().trim();
      
      if (learningKeywords.some(keyword => lowerQuery.includes(keyword))) {
        console.log(`🎯 Quick classification: "${query}" → LEARNING (keyword match)`);
        return true;
      }
      
      if (lowerQuery.length <= 10 && ['yes', 'yeah', 'sure', 'ok', 'okay', 'please', 'help'].includes(lowerQuery)) {
        console.log(`🎯 Quick classification: "${query}" → LEARNING (short affirmative)`);
        return true;
      }
      
      // Use Claude for edge cases
      const classificationPrompt = `Is this query related to learning, education, coding, or academic progress? "${query}" Reply only YES or NO.`;

      const response = await claudeClient.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 5,
        messages: [{ role: 'user', content: classificationPrompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        console.log(`🎯 Claude classification failed for: "${query}" → defaulting to LEARNING`);
        return true;
      }
      
      const isLearning = content.text.trim().toUpperCase() === 'YES';
      console.log(`🎯 Claude classification: "${query}" → ${isLearning ? 'LEARNING' : 'NON-LEARNING'}`);
      return isLearning;
    } catch (error) {
      console.error('❌ Query classification failed:', error);
      console.log(`🎯 Classification error for: "${query}" → defaulting to LEARNING`);
      return true;
    }
  }

  /**
   * Generate response for low confidence situations
   */
  private generateLowConfidenceResponse(query: string, confidence: ConfidenceMetrics): string {
    const prefix = confidenceAnalyzer.generateConfidencePrefix(confidence, query);
    const suffix = confidenceAnalyzer.generateConfidenceSuffix(confidence);
    
    const baseResponse = `I'd love to help with "${query}", but I need more learning data to provide accurate insights.`;
    
    return `${prefix}\n\n${baseResponse}${suffix}`;
  }

  /**
   * Check if we have relevant learning data for the query
   */
  private hasRelevantData(userResults: any, peerResults?: any): boolean {
    const hasUserData = userResults?.documents?.[0]?.length > 0;
    const hasPeerData = peerResults?.documents?.[0]?.length > 0;
    
    return hasUserData || hasPeerData;
  }

  /**
   * Generate casual response for non-learning queries
   */
  private generateCasualResponse(query: string): string {
    const casualResponses = [
      "I'm Thomas, your learning assistant! I'm here to help with your coding, quizzes, and study progress. Is there anything about your learning journey you'd like to discuss?",
      
      "That's interesting! While I'm designed to help with learning and educational topics, I'm always happy to chat. Is there anything about your studies or coding progress you'd like to know about?",
      
      "I focus on helping with learning and academic progress, but I appreciate the conversation! Would you like to review your recent quiz performance or coding challenges instead?",
      
      "I'm specialized in educational assistance and learning analytics. How about we talk about your study progress or any coding concepts you're working on?",
      
      "Thanks for sharing! As your learning assistant, I'm most helpful with educational topics. Would you like insights about your recent learning activities?"
    ];
    
    return casualResponses[Math.floor(Math.random() * casualResponses.length)];
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

  /**
   * Detect if user wants peer comparison insights
   */
  private detectPeerComparisonIntent(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    
    const comparisonKeywords = [
      'compare', 'comparison', 'compared to', 'vs', 'versus', 'vs others',
      'others', 'peers', 'classmates', 'students', 'everyone else', 'other people',
      'my peers', 'other users', 'the class', 'everyone', 'other students',
      'how am i doing', 'how do i compare', 'how do i stack up', 'where do i stand',
      'where am i', 'how am i performing', 'am i doing well', 'am i good',
      'average', 'mean', 'median', 'percentile', 'ranking', 'rank', 'position',
      'top', 'bottom', 'above average', 'below average', 'normal',
      'better than', 'worse than', 'ahead of', 'behind', 'outperform', 'underperform'
    ];
    
    return comparisonKeywords.some(keyword => lowerQuery.includes(keyword));
  }
}

export const ragService = new RAGService();