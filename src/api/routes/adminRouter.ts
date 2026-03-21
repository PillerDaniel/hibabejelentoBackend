import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DIContainer';

import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

import { AdminController } from '../controllers/adminController';

const adminController: AdminController = new AdminController(
    container.getMaintainersQueryHandler
);

const router = express.Router();

router.get(
    '/maintainers',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        adminController.getMaintainers(req, res);
    }
);

export default router;
