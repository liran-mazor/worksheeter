import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, rateLimiter } from '@liranmazor/common';
import { indexQuizzesRouter } from './routes';
import { newQuizRouter } from './routes/new';
import { showQuizRouter } from './routes/show';
import { completeQuizRouter } from './routes/complete';
import helmet from 'helmet';
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
    secure: false, 
     httpOnly: true,                   
    maxAge: 15 * 60 * 1000, 
    domain: '.worksheeter.dev', 
    sameSite: 'lax'
   })
 );

app.use(rateLimiter as any);

app.use(currentUser);

app.use(indexQuizzesRouter);
app.use(newQuizRouter);
app.use(showQuizRouter);
app.use(completeQuizRouter); 

app.use(errorHandler as any);

export { app };