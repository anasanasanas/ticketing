import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@jaxeam/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import 'express-async-errors';

const router = express.Router();

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),
        body("price")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const model = await Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        }).save();

        // await new TicketCreatedPublisher(client).publish({
        //     id: model.id,
        //     title: model.title,
        //     price: model.price,
        //     userId: model.userId
        // });

        res.status(201).send(model);
    }
);

export { router as createTicketRouter };