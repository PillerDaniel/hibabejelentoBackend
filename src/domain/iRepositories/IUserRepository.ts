import User from '../models/User';

export interface IUserRepository {
    getById(id: string): Promise<User | null>;
    create(user: object): Promise<User>;
    getAll(): Promise<Array<User>>;
    findbyEmailOrUsername(
        email: string,
        username: string
    ): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    getMaintainers(
        page: number,
        limit: number
    ): Promise<{ maintainers: User[]; total: number }>;
}
