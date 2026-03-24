/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { GetUserProfileQuery } from '../../application/queries/user/GetUserProfileQuery';
import { GetUserProfileQueryHandler } from '../../application/queries/user/GetUserProfileQueryHandler';

import { AppError } from '../../domain/errors/AppError';

import { logError } from '../../application/utils/bot';

export class UserController {
    constructor(
        private readonly getUserProfileQueryHandler: GetUserProfileQueryHandler
    ) {}

    async getUserProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await this.getUserProfileQueryHandler.handle(
                new GetUserProfileQuery(userId)
            );

            if (!user) {
                throw new AppError(
                    404,
                    'User not found',
                    'A felhasználó nem található'
                );
            }

            return res.status(200).json({ user });
        } catch (error: any) {
            if (error instanceof AppError) {
                if (error instanceof AppError) {
                    return res.status(error.statusCode).json({
                        messageHu: error.messageHu,
                        messageEn: error.messageEn,
                    });
                }
            }

            logError(req.originalUrl, error.message);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}
