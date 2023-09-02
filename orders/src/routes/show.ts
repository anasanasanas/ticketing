import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@jaxeam/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import 'express-async-errors';

const router = express.Router();

router.get('/api/orders/:orderId',
    requireAuth, async (req: Request, res: Response) => {
        const orderId = req.params.orderId;

        await Order.findById(orderId).populate('ticket')
            .then((order) => {
                if (!order)
                    throw new NotFoundError();

                // Make sure that the user requesting this order is the owner of the order
                if (order.userId !== req.currentUser!.id)
                    throw new NotAuthorizedError();

                res.send(order);
            })

    });

export { router as showOrderRouter };
