import { json } from 'body-parser';
import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import cookieSession from 'cookie-session';


import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));


app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Handle all routes that are not found other than the ones above
app.all('*', async (req:Request, res:Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {});
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();
