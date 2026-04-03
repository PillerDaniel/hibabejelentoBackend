import type { Request, Response } from 'express';

import { logError, logCategoryCreate } from '../../application/utils/bot';

import { AppError } from '../../domain/errors/AppError';

//queries
import { GetAllCategoryQueryHandler } from '../../application/queries/category/GetAllCategoryQueryHandler';

//commands
import { CreateCategoryCommand } from '../../application/commands/category/CreateCategoryCommand';
import { CreateCategoryCommandHandler } from '../../application/commands/category/CreateCategoryCommandHandler';

export class CategoryController {
    constructor(
        private readonly getAllCategoryQueryHandler: GetAllCategoryQueryHandler,
        private readonly createCategoryCommandHandler: CreateCategoryCommandHandler
    ) {}

    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await this.getAllCategoryQueryHandler.handle();
            return res.status(200).json(categories);
        } catch (error: any) {
            logError(req.originalUrl, error.message);
            return res.status(500).json({
                messageHu: 'Hiba a kategóriák lekérése során.',
                messageEn: 'Error fetching categories.',
                error: error.message,
            });
        }
    }
    async addCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (!name) {
                throw new AppError(
                    400,
                    'Category name is required.',
                    'A kategória név megadása kötelező.'
                );
            }

            const command = new CreateCategoryCommand(name);
            const category =
                await this.createCategoryCommandHandler.handle(command);

            logCategoryCreate(category.id, req.user!.id);

            return res.status(201).json({
                messageHu: 'Kategória sikeresen létrehozva.',
                messageEn: 'Category created successfully.',
                category,
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            logError(req.originalUrl, error.message);
            return res.status(500).json({
                messageHu: 'Hiba a kategória létrehozása során.',
                messageEn: 'Error creating category.',
                error: error.message,
            });
        }
    }
}
