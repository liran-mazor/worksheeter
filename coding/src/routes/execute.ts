import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@liranmazor/common';
import { judge0Client } from '../lib/judge0-client';
import { CodeExecutedPublisher } from '../events/code-executed-publisher';
import { natsClient } from '../lib/nats-client';
import { randomBytes } from 'crypto';
import { PROBLEMS } from '../lib/problems-data';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/type';
import { CodeService } from '../services/code.service';

const router = express.Router();

router.post(
  '/api/coding/execute',
  [
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Code is required'),
    body('language')
      .trim()
      .notEmpty()
      .withMessage('Language is required')
      .isIn(SUPPORTED_LANGUAGES)
      .withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
    body('problemId')
      .trim()
      .notEmpty()
      .withMessage('Problem ID is required')
      .custom((value) => {
        if (!PROBLEMS[value]) {
          throw new Error('Invalid problem ID');
        }
        return true;
      })
  ],
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, language, problemId } = req.body;
    
    const problem = PROBLEMS[problemId];

    const wrappedCode = CodeService.createCodeTemplate(
      language as SupportedLanguage, 
      code, 
      problem.functionName,
      problemId
    );

    const judge0Response = await judge0Client.executeCodeWithTestCases(
      wrappedCode,
      language,
      problem.testCases
    );

    res.status(200).send(judge0Response);
    
    try {
      await new CodeExecutedPublisher(natsClient.client).publish({
        id: randomBytes(4).toString('hex'),
        userId: req.currentUser!.id,
        problemId,
        problemDescription: problem.description,
        language,
        userCode: CodeService.extractUserCode(wrappedCode),
        wrappedCode,
        judge0Response: CodeService.formatJudge0Response(judge0Response),
        executedAt: new Date().toISOString(),
        version: 0
      });
    } catch (error) {
      console.error('Failed to publish code execution event:', error);
    }
  }
);

export { router as executeCodeRouter };