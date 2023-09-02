import express, { Request, Response } from 'express';
import { requireAuth } from '@jaxeam/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import 'express-async-errors';

const router = express.Router();

router.get('/api/orders', requireAuth,
    async (req: Request, res: Response) => {
        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket');

        res.send(orders);
    });

export { router as indexOrderRouter };

