import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DIContainer';

import { AuthController } from '../controllers/authController';

import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

//dependency injection
const authController: AuthController = new AuthController(
    container.createUserHandler,
    container.loginUserHandler,
    container.logOutCommandHandler
);

const router = express.Router();

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage({
            messageHu: 'A felhasználónév megadása kötelező.',
            messageEn: 'Username is required.',
        }),
        body('firstName').notEmpty().withMessage({
            messageHu: 'A keresztnév megadása kötelező.',
            messageEn: 'First name is required.',
        }),
        body('lastName').notEmpty().withMessage({
            messageHu: 'A vezetéknév megadása kötelező.',
            messageEn: 'Last name is required.',
        }),
        body('email').isEmail().withMessage({
            messageHu: 'Érvénytelen email cím.',
            messageEn: 'Invalid email address.',
        }),
    ],
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        return authController.register(req, res);
    }
);

router.post('/login', async (req: Request, res: Response) => {
    return authController.login(req, res);
});

router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
    return authController.logout(req, res);
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    return authController.me(req, res);
});

export default router;
