import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import User from '../../domain/models/User';
import dataSource from '../db/dataSource';
export class UserRepository implements IUserRepository {
    private repo = dataSource.getRepository(User);

    async getAll() {
        const users: Array<User> = await this.repo.find();
        return users;
    }

    async getById(id: string): Promise<User | null> {
        const user: User | null = await this.repo.findOneBy({ id });
        return user;
    }

    async create(userdata: Partial<User>): Promise<User> {
        const newUser = this.repo.create(userdata);
        await this.repo.save(newUser);
        return newUser;
    }

    async findbyEmailOrUsername(
        email: string,
        username: string
    ): Promise<User | null> {
        const user: User | null = await this.repo.findOne({
            where: [{ email }, { username }],
        });
        return user;
    }

    //async update(id: number, userData: object) {}
}
