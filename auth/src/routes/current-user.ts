import express from 'express';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';
import 'express-async-errors'

const router = express.Router();

router.get('/api/users/currentuser',
    currentUser,
    requireAuth,
    async (req, res) => {
        res.send({ currentUser: req.currentUser || null });
    });

export { router as currentUserRouter };