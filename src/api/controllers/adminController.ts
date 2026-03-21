/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError';

import { GetMaintainersQueryHandler } from '../../application/queries/user/GetMaintainersQueryHandler';
import { GetUserByIdQueryHandler } from '../../application/queries/user/GetUserbyIdQueryHandler';

export class AdminController {
    constructor(
        private readonly getMaintainersQueryHandler: GetMaintainersQueryHandler,
        private readonly getUserByIdQueryHandler: GetUserByIdQueryHandler
    ) {}

    async getMaintainers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;

            const result = await this.getMaintainersQueryHandler.handle({
                page,
                limit,
            });

            return res.status(200).json({
                maintainers: result.maintainers,
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit),
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            const user = await this.getUserByIdQueryHandler.handle({
                userId,
            });

            if (!user) {
                throw new AppError(
                    404,
                    'User not found',
                    'Felhasználó nem található'
                );
            }

            return res.status(200).json({ user });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageEn: error.messageEn,
                    messageHu: error.messageHu,
                });
            }

            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }
}
