import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from './validate-api-key';
import { NotAuthorizedError } from '@liranmazor/common';

export const flexibleAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser) {
    return next();
  }
  
  if (req.headers.authorization?.startsWith('Bearer worksheeter-api-key-12345')) {
    return validateApiKey(req, res, next);
  }
  
  throw new NotAuthorizedError();
};