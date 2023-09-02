import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@jaxeam/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import 'express-async-errors';

const router = express.Router();

// 15 minutes
// Extract it to env variable
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth,
    [
        body('ticketId')
            .notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }


        // Calculate an expiration date for this order
        const expiration = new Date();
        // 15 minutes from now
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();

        res.status(201).send(order);
    });

export { router as newOrderRouter };
