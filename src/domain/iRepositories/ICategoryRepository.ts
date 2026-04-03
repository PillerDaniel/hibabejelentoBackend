import Category from '../models/Category';

export interface ICategoryRepository {
    getAllCategories(): Promise<Category[]>;

    createCategory(name: string): Promise<Category>;
}
