import type { Request, Response } from 'express';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { LoginUserCommand } from '../../application/commands/LoginUserCommand';
import { CreateUserCommandHandler } from '../../application/commands/CreateUserCommandHandler';
import { LoginUserCommandHandler } from '../../application/commands/LoginUserCommandHandler';

export class AuthController {
    constructor(
        private readonly createUserCommandHandler: CreateUserCommandHandler,
        private readonly loginUserCommandHandler: LoginUserCommandHandler
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

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    messageHu: 'Minden mező kitöltése kötelező.',
                    messageEn: 'All fields are required.',
                });
            }
            const cmd = new LoginUserCommand(username, password);
            const result = await this.loginUserCommandHandler.handle(cmd);
            res.status(200).json({
                messageHu: 'Sikeres bejelentkezés.',
                messageEn: 'Login successful.',
                token: result.token,
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            res.status(500).json({
                messageHu: 'Hiba a bejelentkezés során.',
                messageEn: 'Error during login.',
                error: error.message,
            });
        }
    }
}
