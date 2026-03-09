import { ICategoryRepository } from '../../domain/iRepositories/ICategoryRepository';
import Category from '../../domain/models/Category';
import dataSource from '../db/dataSource';

export class CategoryRepository implements ICategoryRepository {
    repo = dataSource.getRepository(Category);

    async getAllCategories(): Promise<Category[]> {
        return this.repo.find();
    }
}
