import bcrypt from 'bcrypt';
import { CreateUserCommand } from './CreateUserCommand';
import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import User from '../../domain/models/User';

import { AppError } from '../../domain/errors/AppError';

export class CreateUserCommandHandler {
    constructor(private readonly userRepository: IUserRepository) {}

    async handle(cmd: CreateUserCommand): Promise<User> {
        const existingUser = await this.userRepository.findbyEmailOrUsername(
            cmd.email,
            cmd.username
        );
        if (existingUser) {
            throw new AppError(
                409,
                'User with this email or username already exists',
                'Ez az email vagy felhasználónév már foglalt.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(cmd.password, salt);

        const userData: Partial<User> = {
            username: cmd.username,
            firstName: cmd.firstName,
            lastName: cmd.lastName,
            email: cmd.email,
            password: passwordHash,
        };

        return await this.userRepository.create(userData);
    }
}
