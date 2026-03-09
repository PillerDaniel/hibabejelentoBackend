// needed to use user in request
/// <reference path="../../types/express.d.ts" />
import express from 'express';
import { container } from '../../application/services/DIContainer';

//middleware
import authMiddleware from '../middlewares/authMiddleware';

import { CategoryController } from '../controllers/categoryController';

const router = express.Router();

const categoryController = new CategoryController(
    container.getAllCategoryQueryHandler
);

router.get('/', authMiddleware, async (req, res) => {
    await categoryController.getAllCategories(req, res);
});

export default router;
