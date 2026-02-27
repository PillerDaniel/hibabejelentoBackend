// needed to use user in request
/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { LoginUserCommand } from '../../application/commands/LoginUserCommand';
import { LogOutCommand } from '../../application/commands/LogOutCommand';
import { CreateUserCommandHandler } from '../../application/commands/CreateUserCommandHandler';
import { LoginUserCommandHandler } from '../../application/commands/LoginUserCommandHandler';
import { LogOutCommandHandler } from '../../application/commands/LogOutCommandHandler';

export class AuthController {
    constructor(
        private readonly createUserCommandHandler: CreateUserCommandHandler,
        private readonly loginUserCommandHandler: LoginUserCommandHandler,
        private readonly logOutCommandHandler: LogOutCommandHandler
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

            //cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                //secure: true, //only HTTPS',
                sameSite: 'strict',
                maxAge: 3600000, // 1 hour
            });

            res.status(200).json({
                messageHu: 'Sikeres bejelentkezés.',
                messageEn: 'Login successful.',
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
    async logout(req: Request, res: Response) {
        try {
            const sessionId = req.user?.sessionId;
            console.log(req.user);
            if (sessionId) {
                const cmd = new LogOutCommand(sessionId);
                await this.logOutCommandHandler.handle(cmd);
            }
            res.clearCookie('token');
            res.status(200).json({
                messageHu: 'Sikeres kijelentkezés.',
                messageEn: 'Logout successful.',
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            res.status(500).json({
                messageHu: 'Hiba a kijelentkezés során.',
                messageEn: 'Error during logout.',
                error: error.message,
            });
        }
    }
}
