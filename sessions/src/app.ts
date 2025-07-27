import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import { currentUser, errorHandler, rateLimiter } from '@liranmazor/common';
import { healthRouter } from './routes/health';
import { showSessionRouter } from './routes/show';
import { uploadSessionRouter } from './routes/upload';
import { indexSessionsRouter } from './routes';

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
    domain: '.worksheeter.dev', 
    sameSite: 'lax' 
  })
);

app.use(currentUser); 
app.use(rateLimiter as any);

app.use(uploadSessionRouter);
app.use(indexSessionsRouter);
app.use(showSessionRouter);

app.use(errorHandler as any);

export { app };