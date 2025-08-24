import jwt from 'jsonwebtoken';
import { Request } from 'express';

interface UserPayload {
  id: string;
  email: string;
}

export class JWTService {
  static generateToken(user: UserPayload): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
  }

  static setUserSession(req: Request, user: UserPayload): void {
    const userJwt = this.generateToken(user);
    req.session = {
      jwt: userJwt,
    };
  }
}
