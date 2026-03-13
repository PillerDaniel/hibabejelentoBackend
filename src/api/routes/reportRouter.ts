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
    container.getReportForMaintainerQueryHandler,
    container.createReportCommandHandler,
    container.editReportStatusCommandHandler,
    container.assignReportToMaintainerCommandHandler
);

const router = express.Router();

router.get(
    '/user',
    authMiddleware,
    roleMiddleware(['user', 'admin']),
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

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['user', 'admin']),
    async (req: Request, res: Response) => {
        reportController.createReport(req, res);
    }
);

router.patch(
    '/:id',
    authMiddleware,
    roleMiddleware(['maintainer', 'admin']),
    async (req: Request, res: Response) => {
        reportController.editReportStatus(req, res);
    }
);

router.patch(
    '/:id/assign',
    authMiddleware,
    roleMiddleware(['maintainer', 'admin']),
    async (req: Request, res: Response) => {
        reportController.assignReportToMaintainer(req, res);
    }
);

export default router;
