import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, rateLimiter } from '@liranmazor/common';
import helmet from 'helmet';
import { healthRouter } from './routes/health';
import { executeCodeRouter } from './routes/execute';
import { problemsRouter } from './routes/problems';

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
    secure: false, 
    httpOnly: true, 
    maxAge: 5 * 60 * 60 * 1000,  
    domain: undefined, 
    sameSite: 'lax'
  })
 );

app.use(currentUser);
app.use(rateLimiter as any);

app.use(executeCodeRouter);
app.use(problemsRouter);

app.use(errorHandler as any);

export { app };