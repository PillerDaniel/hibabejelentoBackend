import type { Request, Response } from 'express';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { CreateUserCommandHandler } from '../../application/commands/CreateUserCommandHandler';

export class AuthController {
    constructor(
        private readonly createUserCommandHandler: CreateUserCommandHandler
    ) {}

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
            const user = await this.createUserCommandHandler.handle(cmd);
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
