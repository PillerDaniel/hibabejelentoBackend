import type { Request, Response } from 'express';

//queries
import { GetAllCategoryQueryHandler } from '../../application/queries/category/GetAllCategoryQueryHandler';

export class CategoryController {
    constructor(
        private readonly getAllCategoryQueryHandler: GetAllCategoryQueryHandler
    ) {}

    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await this.getAllCategoryQueryHandler.handle();
            return res.status(200).json(categories);
        } catch (error: any) {
            return res.status(500).json({
                messageHu: 'Hiba a kategóriák lekérése során.',
                messageEn: 'Error fetching categories.',
                error: error.message,
            });
        }
    }
}
