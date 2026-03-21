import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DIContainer';

import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

import { StatisticsController } from '../controllers/statisticsController';

const statisticsController: StatisticsController = new StatisticsController(
    container.getOverallStatisticQueryHandler,
    container.getStatisticForMaintainerQueryHandler
);

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    roleMiddleware(['maintainer', 'admin']),
    (req: Request, res: Response) => {
        statisticsController.getStatistics(req, res);
    }
);

router.get(
    '/maintainer',
    authMiddleware,
    roleMiddleware(['maintainer', 'admin']),
    (req: Request, res: Response) => {
        statisticsController.getStatisticsForMaintainer(req, res);
    }
);

router.get(
    '/admin/:maintainerId',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        statisticsController.getStatisticsForAdmin(req, res);
    }
);

export default router;
