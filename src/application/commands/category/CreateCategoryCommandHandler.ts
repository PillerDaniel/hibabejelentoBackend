import Category from '../../../domain/models/Category';
import { ICategoryRepository } from '../../../domain/iRepositories/ICategoryRepository';
import { CreateCategoryCommand } from './CreateCategoryCommand';

export class CreateCategoryCommandHandler {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async handle(cmd: CreateCategoryCommand): Promise<Category> {
        const category = await this.categoryRepository.createCategory(cmd.name);
        return category;
    }
}
