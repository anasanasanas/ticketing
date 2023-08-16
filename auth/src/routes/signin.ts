import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import 'express-async-errors'

const router = express.Router();

router.post('/api/users/signin', [
    // Validate email and password
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
],
    validateRequest
    , (req: Request, res: Response) => {
        res.send({});
    });

export { router as signInRouter };