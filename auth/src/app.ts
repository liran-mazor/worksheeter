import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import helmet from 'helmet';

import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { errorHandler, rateLimiter } from '@liranmazor/ticketing-common';
import { healthRouter } from './routes/health';

const app = express();

app.set('trust proxy', true);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(healthRouter);

app.use(json());

app.use(
   cookieSession({
     signed: false,
     secure: process.env.NODE_ENV !== 'test',
     httpOnly: true,                   
     sameSite: 'lax',        
     maxAge: 24 * 60 * 60 * 1000
   })
 );

app.use(rateLimiter as any);

app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);

app.use(errorHandler as any);

export { app };