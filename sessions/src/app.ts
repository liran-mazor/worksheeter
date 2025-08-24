import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import { currentUser, errorHandler, rateLimiter } from '@liranmazor/common';
import { healthRouter } from './routes/health';
import { showSessionRouter } from './routes/show';
import { newSessionRouter } from './routes/new';
import { indexSessionsRouter } from './routes';
import { sessionWebhookRouter } from './routes/webhook';
import { endSessionRouter } from './routes/end';
import { deleteSessionRouter } from './routes/delete';

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

app.use(newSessionRouter);
app.use(indexSessionsRouter);
app.use(showSessionRouter);
app.use(sessionWebhookRouter);
app.use(endSessionRouter);
app.use(deleteSessionRouter);

app.use(errorHandler as any);

export { app };