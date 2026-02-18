import type { Request, Response } from 'express';

import { UserRepository } from '../../infrastructure/repositories/UserRepository';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { CreateUserHandler } from '../../application/commands/CreateUserCommandHandler';

export class AuthController {
    private userRepository: UserRepository;
    private createUserHandler: CreateUserHandler;

    constructor() {
        this.userRepository = new UserRepository();
        this.createUserHandler = new CreateUserHandler(this.userRepository);
    }

    async register(req: Request, res: Response) {
        try {
            const { username, firstName, lastName, email, password } = req.body;

            const cmd = new CreateUserCommand(
                username,
                firstName,
                lastName,
                email,
                password
            );
            const user = await this.createUserHandler.handle(cmd);
            res.status(201).json({
                messageHu: 'Sikeres regisztráció.',
                messageEn: 'Registration successful.',
                userId: user.id,
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            res.status(500).json({
                messageHu: 'Hiba a regisztráció során.',
                messageEn: 'Error during registration.',
                error: error.message,
            });
        }
    }
}
