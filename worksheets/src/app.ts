import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, rateLimiter } from '@liranmazor/common';
import { newWorksheetRouter } from './routes/new';
import { showWorksheetRouter } from './routes/show';
import { indexWorksheetsRouter } from './routes';
import { deleteWorksheetRouter } from './routes/delete';
import { updateWorksheetRouter } from './routes/update';
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

app.use(newWorksheetRouter);
app.use(showWorksheetRouter);
app.use(indexWorksheetsRouter);
app.use(deleteWorksheetRouter);
app.use(updateWorksheetRouter);

app.use(errorHandler as any);

export { app };