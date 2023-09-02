import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@jaxeam/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import 'express-async-errors';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate('ticket')

    if (!order)
        throw new NotFoundError();

    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
});

export { router as deleteOrderRouter };
