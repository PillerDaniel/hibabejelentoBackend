// needed to use user in request
/// <reference path="../../types/express.d.ts" />
import express from 'express';
import { container } from '../../application/services/DIContainer';

//middleware
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

import { CategoryController } from '../controllers/categoryController';

const router = express.Router();

const categoryController = new CategoryController(
    container.getAllCategoryQueryHandler,
    container.createCategoryCommandHandler
);

router.get('/', authMiddleware, async (req, res) => {
    await categoryController.getAllCategories(req, res);
});

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        await categoryController.addCategory(req, res);
    }
);

export default router;
