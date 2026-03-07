import express from 'express';
import { Request, Response } from 'express';

import { container } from '../../application/services/DIContainer';

import { ReportController } from '../controllers/reportController';

//middlewares
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

//dependency injection
const reportController: ReportController = new ReportController(
    container.getReportByUserQueryHandler,
    container.getReportForMaintainerQueryHandler
);

const router = express.Router();

router.get(
    '/user',
    authMiddleware,
    roleMiddleware(['user']),
    async (req: Request, res: Response) => {
        reportController.getReportsByUser(req, res);
    }
);

router.get(
    '/maintainer',
    authMiddleware,
    roleMiddleware(['maintainer', 'admin']),
    async (req: Request, res: Response) => {
        reportController.getReportsForMaintainer(req, res);
    }
);
export default router;
