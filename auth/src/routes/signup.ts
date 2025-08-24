import express, {Request, Response} from 'express';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@liranmazor/common';
import { User } from '../models/user';
import { JWTService } from '../services/jwt.service';

const router = express.Router();

router.post('/api/auth/users/signup', 
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({min:4, max: 20})
      .withMessage('Password must be between 4 and 20 chars')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const exsitingUser = await User.findOne({ email });

    if(exsitingUser){
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    JWTService.setUserSession(req, {
      id: user.id,
      email: user.email,
    });

    res.status(201).send(user);
});

export { router as signupRouter };