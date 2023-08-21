import { json } from 'body-parser';
import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@jaxeam/common';
import 'express-async-errors';

export const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

// TODO: `Add routers`

// Handle all routes that are not found other than the ones above
app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);