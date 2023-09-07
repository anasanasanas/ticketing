import express, { Request, Response } from 'express';
import { expirationQueue } from '../expiration-queue';
import { currentUser } from '@jaxeam/common';

import 'express-async-errors'

const router = express.Router();

router.post('/api/expiration/addJob',
    async (req: Request, res: Response) => {

        await expirationQueue.add({
            orderId: '1234',
        }, { delay: 10000 });

        res.status(200).send({ message: 'Expiration service' });
    });

export { router as newExpirationRouter };