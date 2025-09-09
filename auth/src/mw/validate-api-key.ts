import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { NotAuthorizedError } from '@liranmazor/common';

interface AuthRequest extends Request {
  currentUser?: {
    id: string;
    email: string;
  };
}

export const validateApiKey = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Check for the constant POC API key
    if (!authHeader?.startsWith('Bearer worksheeter-api-key-12345')) {
      throw new NotAuthorizedError();
    }

    // For POC: Associate with the first available user
    // In production, you'd have proper user-key associations
    const user = await User.findOne();
    
    if (!user) {
      throw new NotAuthorizedError();
    }

    req.currentUser = { id: user.id, email: user.email };
    next();
  } catch (error) {
    throw new NotAuthorizedError();
  }
};