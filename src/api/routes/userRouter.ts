import express from 'express';
import type { Request, Response } from 'express';
import { container } from '../../application/services/DIContainer';

import authMiddleware from '../middlewares/authMiddleware';

import { UserController } from '../controllers/userController';

const userController: UserController = new UserController(
    container.getUserProfileQueryHandler
);

const router = express.Router();

router.get('/profile', authMiddleware, (req: Request, res: Response) => {
    userController.getUserProfile(req, res);
});

export default router;
