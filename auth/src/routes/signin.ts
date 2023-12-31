import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@jaxeam/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import { currentUser } from '@jaxeam/common';

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
    validateRequest,
    currentUser,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        // Check if password is correct
        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        // Store JWT on session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send({ user: existingUser, token: userJwt });
    });

export { router as signInRouter };