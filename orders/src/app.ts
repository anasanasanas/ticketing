import { json } from 'body-parser';
import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jaxeam/common';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
import 'express-async-errors';

export const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

// Add routes to the app
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);


// Handle all routes that are not found other than the ones above
app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);