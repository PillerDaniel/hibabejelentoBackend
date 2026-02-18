import User from '../models/User';

export interface IUserRepository {
    getById(id: string): Promise<User | null>;
    create(user: object): Promise<User>;
    //update(id: string, userData: Partial<User>): Promise<User | null>;
    getAll(): Promise<Array<User>>;
    findbyEmailOrUsername(
        email: string,
        username: string
    ): Promise<User | null>;
}
