import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "@jaxeam/common";
import 'express-async-errors';

const router = express.Router();

router.post(
    "/api/tickets",
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),
        body("price")
            .notEmpty()
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        res.sendStatus(201);
    }
);

export { router as createTicketRouter };