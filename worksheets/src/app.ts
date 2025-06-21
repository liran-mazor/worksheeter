import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@liranmazor/ticketing-common';
import { newWorksheetRouter } from './routes/new';
import { showWorksheetRouter } from './routes/show';
import { indexWorksheetsRouter } from './routes';
import { deleteWorksheetRouter } from './routes/delete';
import { updateWorksheetRouter } from './routes/update';

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

app.use(newWorksheetRouter);
app.use(showWorksheetRouter);
app.use(indexWorksheetsRouter);
app.use(deleteWorksheetRouter);
app.use(updateWorksheetRouter);

app.use(errorHandler as any);

export { app };