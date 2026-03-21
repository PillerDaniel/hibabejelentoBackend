/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { GetMaintainersQueryHandler } from '../../application/queries/user/GetMaintainersQueryHandler';

export class AdminController {
    constructor(
        private readonly getMaintainersQueryHandler: GetMaintainersQueryHandler
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
}
