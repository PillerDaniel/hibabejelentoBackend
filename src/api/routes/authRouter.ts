import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { AuthController } from '../controllers/authController';
const authController: AuthController = new AuthController();

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
        body('password')
            .isLength({ min: 8 })
            .withMessage({
                messageHu: 'A jelszónak legalább 8 karakterből kell állnia.',
                messageEn: 'Password must be at least 8 characters.',
            })
            .matches(/[A-Z]/)
            .withMessage({
                messageHu:
                    'A jelszónak legalább egy nagybetűt kell tartalmaznia.',
                messageEn:
                    'Password must contain at least one uppercase letter.',
            })
            .matches(/\d/)
            .withMessage({
                messageHu: 'A jelszónak legalább egy számot kell tartalmaznia.',
                messageEn: 'Password must contain at least one number.',
            }),
    ],
    async (req: Request, res: Response) => {
        console.log('Received registration request:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        return authController.register(req, res);
    }
);

export default router;
