// needed to use user in request
/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/user/CreateUserCommand';
import { LoginUserCommand } from '../../application/commands/user/LoginUserCommand';
import { LogOutCommand } from '../../application/commands/user/LogOutCommand';
import { CreateUserCommandHandler } from '../../application/commands/user/CreateUserCommandHandler';
import { LoginUserCommandHandler } from '../../application/commands/user/LoginUserCommandHandler';
import { LogOutCommandHandler } from '../../application/commands/user/LogOutCommandHandler';
import { ChangeUserPasswordCommand } from '../../application/commands/user/ChangeUserPasswordCommand';
import { ChangeUserPasswordCommandHandler } from '../../application/commands/user/ChangeUserPasswordCommandHandler';

import { logError } from '../../application/utils/bot';

export class AuthController {
    constructor(
        private readonly createUserCommandHandler: CreateUserCommandHandler,
        private readonly loginUserCommandHandler: LoginUserCommandHandler,
        private readonly logOutCommandHandler: LogOutCommandHandler,
        private readonly changeUserPasswordCommandHandler: ChangeUserPasswordCommandHandler
    ) {}

    async register(req: Request, res: Response) {
        try {
            const { username, firstName, lastName, email, role } = req.body;
            const adminId = req.user!.id;

            const cmd = new CreateUserCommand(
                username,
                firstName,
                lastName,
                email,
                role,
                adminId
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

            logError(req.originalUrl, error.message);

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
                user: result.user,
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

            logError(req.originalUrl, error.message);

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

            logError(req.originalUrl, error.message);

            res.status(500).json({
                messageHu: 'Hiba a kijelentkezés során.',
                messageEn: 'Error during logout.',
                error: error.message,
            });
        }
    }
    async me(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    messageHu: 'Nincs bejelentkezett felhasználó.',
                    messageEn: 'Not authenticated.',
                });
            }
            return res.status(200).json({
                user: { username: req.user.username, role: req.user.role },
            });
        } catch (error: any) {
            logError(req.originalUrl, error.message);
            res.status(500).json({
                messageHu: 'Hiba a felhasználó lekérdezése során.',
                messageEn: 'Error retrieving user information.',
                error: error.message,
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { oldpassword, newpassword } = req.body;

            const username = req.user!.username;

            await this.changeUserPasswordCommandHandler.handle(
                new ChangeUserPasswordCommand(
                    username,
                    oldpassword,
                    newpassword
                )
            );

            res.status(200).json({
                messageHu: 'Jelszó sikeresen megváltoztatva.',
                messageEn: 'Password changed successfully.',
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            logError(req.originalUrl, error.message);

            res.status(500).json({
                messageHu: 'Hiba a jelszó módosítása során.',
                messageEn: 'Error during password change.',
                error: error.message,
            });
        }
    }
}
