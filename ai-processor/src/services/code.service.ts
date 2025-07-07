import { claudeClient } from '../lib/claude-client';
import { ClaudeApiError, CodeAnalysis } from '@liranmazor/common';

export class CodeService {
  async generateCodeAnalysis(
    problemDescription: string,
    userCode: string,
    language: string,
    testResults: any[],
    overallStatus: string
  ): Promise<CodeAnalysis> {
    const operation = 'code analysis';
    
    try {
      const prompt = `You are an expert code reviewer analyzing a coding solution. Be thorough but fair in your assessment.

Problem: ${problemDescription}
Language: ${language}

User's Code:
\`\`\`${language}
${userCode}
\`\`\`

Test Results:
${testResults.map(test => 
`Input: ${test.input} | Expected: ${test.expectedOutput} | Got: ${test.actualOutput} | ${test.passed ? 'PASSED' : 'FAILED'}`
).join('\n')}

ANALYSIS GUIDELINES:
- Be constructive and educational, not overly critical
- Focus on the most impactful improvements first
- Consider that working solutions deserve credit even if not perfect
- Be specific about issues and provide actionable suggestions
- Pay attention to subtle issues like spacing, multiple edge cases, and performance

SCORING GUIDELINES (0-100):
- syntaxAccuracy: Deduct for var vs let/const (-5), == vs === (-5), missing semicolons (-3)
- algorithmCorrectness: Major logic errors (-20+), missing edge cases (-10-15), inefficient approach (-5-10)
- edgeCaseHandling: No null checks (-15), case sensitivity issues (-10), boundary conditions (-10), spacing issues (-10)
- codeQuality: Poor naming (-5), no validation (-10), outdated practices (-5-10), string concatenation in loops (-5)
- readability: Unclear logic (-10), poor structure (-10), missing comments for complex logic (-5)

STRUGGLE CATEGORIES (use these exact strings):
syntax, variable_declaration, data_types, function_signature, parameter_handling, return_values,
loop_logic, conditional_logic, edge_cases, time_complexity, space_complexity, optimization,
array_manipulation, string_manipulation, object_usage, algorithm_approach, problem_understanding, debugging

SPECIFIC ISSUES TO WATCH FOR:
- Multiple consecutive spaces in string handling
- String concatenation in loops (performance)
- Input type validation beyond null/undefined
- Case sensitivity in string operations
- Boundary conditions (empty arrays, single elements)

Respond in this exact JSON format:
{
"feedback": {
  "overallAssessment": "1-2 sentence summary of solution quality and main areas for improvement",
  "suggestions": ["specific, actionable improvement 1", "specific, actionable improvement 2", "specific, actionable improvement 3"],
  "strengths": ["what they did well 1", "what they did well 2"],
  "testCaseAnalysis": ["analysis of why tests passed/failed", "potential hidden issues not caught by tests"]
},
"analytics": {
  "strugglingAreas": [
    {
      "category": "exact_category_from_list_above",
      "intensity": "minor|moderate|major|critical", 
      "evidence": "specific code example or explanation",
      "confidence": 0.8
    }
  ],
  "metrics": {
    "codeQuality": 65,
    "algorithmCorrectness": 85,
    "syntaxAccuracy": 75,
    "edgeCaseHandling": 45,
    "readability": 80
  },
  "context": {
    "problemDifficulty": "easy|medium|hard",
    "codeLength": ${userCode.length},
    "languageFeatures": ["specific features used like loops, conditionals, arrays, etc"]
  }
}
}`;
      
      const responseText = await claudeClient.callClaude(prompt, 4000, operation);
      return claudeClient.parseJsonResponse<CodeAnalysis>(responseText, operation);
    } catch (error) {
      throw new ClaudeApiError(operation, error);
    }
  }
}
export const codeService = new CodeService();