import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { PasswordService } from '../services/password.service';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@liranmazor/common';
import { JWTService } from '../services/jwt.service'; 

const router = express.Router();

router.post('/api/auth/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('You must Sign-Up first');
    }

    const passwordsMatch = await PasswordService.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Password does not match');
    }

    JWTService.setUserSession(req, {
      id: existingUser.id,
      email: existingUser.email,
    });

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };