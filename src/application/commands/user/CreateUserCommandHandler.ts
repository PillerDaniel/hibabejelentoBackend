import bcrypt from 'bcrypt';
import { CreateUserCommand } from './CreateUserCommand';
import { IUserRepository } from '../../../domain/iRepositories/IUserRepository';
import { IEmailService } from '../../../domain/IServices/IEmailService';
import User from '../../../domain/models/User';
import { PasswordGenerator } from '../../utils/passwordGenerator';
import { EmailTemplateService } from '../../services/EmailTemplateService';

import { logEmailError } from '../../utils/bot';

import { AppError } from '../../../domain/errors/AppError';

export class CreateUserCommandHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService
    ) {}

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

        const password = PasswordGenerator.generate(8);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userData: Partial<User> = {
            username: cmd.username,
            firstName: cmd.firstName,
            lastName: cmd.lastName,
            email: cmd.email,
            password: passwordHash,
        };

        const user = await this.userRepository.create(userData);

        try {
            const html = EmailTemplateService.getRegistrationEmailHtml(
                user.username,
                password
            );

            await this.emailService.sendRegisterEmail(
                user.email,
                'Bejelentkezési adatok - Hibabejelentő',
                html
            );
        } catch (error: any) {
            await logEmailError(
                `Error sending registration email for user: ${user.email}`,
                error.message || error
            );
        }

        return user;
    }
}
