/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { GetOverallStatisticQueryHandler } from '../../application/queries/statistic/getOverallStatisticQueryHandler';
import { GetStatisticForMaintainerQueryHandler } from '../../application/queries/statistic/getStatisticForMaintainerQueryHandler';

import { GetStatisticForMaintainerQuery } from '../../application/queries/statistic/getStatisticForMaintainerQuery';

import { logError } from '../../application/utils/bot';

export class StatisticsController {
    constructor(
        private getOverallStatisticQueryHandler: GetOverallStatisticQueryHandler,
        private getStatisticForMaintainerQueryHandler: GetStatisticForMaintainerQueryHandler
    ) {}

    async getStatistics(req: Request, res: Response) {
        try {
            const statistics =
                await this.getOverallStatisticQueryHandler.handle();
            res.status(200).json(statistics);
        } catch (error: any) {
            logError(req.originalUrl, error.message);
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }

    async getStatisticsForMaintainer(req: Request, res: Response) {
        try {
            const maintainerId = req.user!.id;
            const statistics =
                await this.getStatisticForMaintainerQueryHandler.handle(
                    new GetStatisticForMaintainerQuery(maintainerId)
                );

            res.status(200).json(statistics);
        } catch (error: any) {
            logError(req.originalUrl, error.message);
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }

    async getStatisticsForAdmin(req: Request, res: Response) {
        try {
            const maintainerId = req.params.maintainerId as string;
            const statistics =
                await this.getStatisticForMaintainerQueryHandler.handle(
                    new GetStatisticForMaintainerQuery(maintainerId)
                );
            res.status(200).json(statistics);
        } catch (error: any) {
            logError(req.originalUrl, error.message);
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }
}
