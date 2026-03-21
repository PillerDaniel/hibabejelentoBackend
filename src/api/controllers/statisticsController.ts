/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { GetOverallStatisticQueryHandler } from '../../application/queries/statistic/getOverallStatisticQueryHandler';

export class StatisticsController {
    constructor(
        private getOverallStatisticQueryHandler: GetOverallStatisticQueryHandler
    ) {}

    async getStatistics(req: Request, res: Response) {
        try {
            const statistics =
                await this.getOverallStatisticQueryHandler.handle();
            res.status(200).json(statistics);
        } catch (error) {
            res.status(500).send('Error occurred while fetching statistics');
        }
    }

    async getStatisticsForMaintainer(req: Request, res: Response) {
        res.send('Statistics data for maintainer');
    }

    async getStatisticsForAdmin(req: Request, res: Response) {
        res.send('Statistics data for admin');
    }
}
