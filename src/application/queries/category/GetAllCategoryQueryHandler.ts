import { ICategoryRepository } from '../../../domain/iRepositories/ICategoryRepository';

export class GetAllCategoryQueryHandler {
    constructor(private categoryRepository: ICategoryRepository) {}

    async handle() {
        const categories = await this.categoryRepository.getAllCategories();
        return categories;
    }
}
