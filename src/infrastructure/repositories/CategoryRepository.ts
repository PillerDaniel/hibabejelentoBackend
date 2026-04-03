import { ICategoryRepository } from '../../domain/iRepositories/ICategoryRepository';
import Category from '../../domain/models/Category';
import dataSource from '../db/dataSource';

export class CategoryRepository implements ICategoryRepository {
    repo = dataSource.getRepository(Category);

    async getAllCategories(): Promise<Category[]> {
        return this.repo.find();
    }

    async createCategory(name: string): Promise<Category> {
        const category = this.repo.create({ name });
        await this.repo.save(category);
        return category;
    }
}
