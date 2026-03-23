import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import User from '../../domain/models/User';
import dataSource from '../db/dataSource';
import { UserRole } from '../../domain/enums/UserRole';
export class UserRepository implements IUserRepository {
    private repo = dataSource.getRepository(User);

    async getAll() {
        const users: Array<User> = await this.repo.find();
        return users;
    }

    async getById(id: string): Promise<User | null> {
        const user = await this.repo.findOne({
            where: { id },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

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

    async findByUsername(username: string): Promise<User | null> {
        const user: User | null = await this.repo.findOneBy({ username });
        return user;
    }

    async getMaintainers(
        page: number,
        limit: number
    ): Promise<{ maintainers: User[]; total: number }> {
        const skip = (page - 1) * limit;
        const [maintainers, total] = await this.repo.findAndCount({
            where: { role: 'maintainer' as UserRole },
            select: ['id', 'username', 'email', 'createdAt'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return { maintainers: maintainers, total };
    }

    async changePassword(userId: string, newPassword: string): Promise<void> {
        await this.repo.update({ id: userId }, { password: newPassword });
    }
}
