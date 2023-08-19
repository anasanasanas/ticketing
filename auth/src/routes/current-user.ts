import express from 'express';
import { currentUser, requireAuth } from '@jaxeam/common';
import 'express-async-errors'

const router = express.Router();

router.get('/api/users/currentuser',
    currentUser,
    requireAuth,
    async (req, res) => {
        res.send({ currentUser: req.currentUser || null });
    });

export { router as currentUserRouter };