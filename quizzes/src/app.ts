import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@liranmazor/ticketing-common';
import { indexQuizzesRouter } from './routes';
import { newQuizRouter } from './routes/new';
import { showQuizRouter } from './routes/show';
import { completeQuizRouter } from './routes/complete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(indexQuizzesRouter);
app.use(newQuizRouter);
app.use(showQuizRouter);
app.use(completeQuizRouter); 

app.use(errorHandler as any);

export { app };