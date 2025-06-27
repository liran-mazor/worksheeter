import express, { Request, Response } from 'express';
import { requireAuth, CodeExecutionError } from '@liranmazor/common';
import { judge0Client } from '../lib/judge0-client';
import { CodeExecutedPublisher } from '../events/code-executed-publisher';
import { natsClient } from '../lib/nats-client';
import { randomBytes } from 'crypto';
import { formatJudge0Response, extractUserCode, createCodeTemplate } from '../lib/utils';
import { PROBLEMS } from '../lib/problems-data';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../lib/types';

const router = express.Router();

router.post(
  '/api/coding/execute',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code, language, problemId } = req.body;
    
    // Validate problem exists
    const problem = PROBLEMS[problemId];
    if (!problem) {
      throw new CodeExecutionError('Unknown problem', problemId);
    }

    // Validate language support
    if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
      throw new CodeExecutionError('Unsupported language', language);
    }

    // Execute code using the new template system
    const wrappedCode = createCodeTemplate(
      language as SupportedLanguage, 
      code, 
      problem.functionName,
      problemId
    );

    let judge0Response;
    try {
      judge0Response = await judge0Client.executeCodeWithTestCases(
        wrappedCode,
        language,
        problem.testCases
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new CodeExecutionError('code execution', errorMessage);
    }

    // Format Judge0 response and extract user code for AI processor
    const formattedResponse = formatJudge0Response(judge0Response);
    const userCode = extractUserCode(wrappedCode);

    res.status(200).send(judge0Response);
    
    try {
      await new CodeExecutedPublisher(natsClient.client).publish({
        id: randomBytes(4).toString('hex'),
        userId: req.currentUser!.id,
        problemId,
        problemDescription: problem.description,
        language,
        userCode,
        wrappedCode,
        judge0Response: formattedResponse,
        executedAt: new Date().toISOString(),
        version: 0
      });
    } catch (error) {
      console.error('Failed to publish code execution event:', error);
    }
  }
);

export { router as executeCodeRouter };