import Category from '../models/Category';

export interface ICategoryRepository {
    getAllCategories(): Promise<Category[]>;
}
