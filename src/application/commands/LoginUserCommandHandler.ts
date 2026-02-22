import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import config from 'config';

import { LoginUserCommand } from './LoginUserCommand';

import { IUserRepository } from '../../domain/iRepositories/IUserRepository';
import { ISessionStore } from '../../domain/iRepositories/ISessionStore';

import { AppError } from '../../domain/errors/AppError';

const JWT_SECRET = config.get<string>('JWT_SECRET');

export class LoginUserCommandHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionStore: ISessionStore
    ) {}
    async handle(cmd: LoginUserCommand): Promise<{ token: string }> {
        const user = await this.userRepository.findByUsername(cmd.username);
        //if user not found by username
        if (!user) {
            throw new AppError(
                401,
                'Invalid credentials.',
                'A megadott adatokkal nem található felhasználó.'
            );
        }
        //pw validation
        const isMatch = await bcrypt.compare(cmd.password, user.password);

        //pw check
        if (!isMatch) {
            throw new AppError(401, 'Invalid password', 'Helytelen jelszó');
        }

        //user inac
        if (!user.active) {
            throw new AppError(
                401,
                'Inactive user',
                'A megadott felhasználó inaktív.'
            );
        }

        //rediss sess
        const sessionId = await this.sessionStore.createSession(
            user.id,
            user.role
        );

        //jwt token
        const token = JWT.sign(
            { sessionId, username: user.username },
            JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        return { token: token };
    }
}
