
import express, { Request, Response } from 'express';
import { validateApiKey } from '../mw/validate-api-key';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/auth/test-api-key', validateApiKey, (req: Request, res: Response) => {
  res.json({
    message: 'API key is valid!',
    user: req.currentUser
  });
});

export { router as testApiKeyRouter };