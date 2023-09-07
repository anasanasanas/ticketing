import { app } from './app';
import 'express-async-errors';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }
    if (!process.env.REDIS_HOST) {
        throw new Error('REDIS_HOST must be defined!');
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();
