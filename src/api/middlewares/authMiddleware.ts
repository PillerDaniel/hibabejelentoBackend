// needed to use user in request
/// <reference path="../../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import config from 'config';

import { container } from '../../application/services/DIContainer';

const JWT_SECRET = config.get<string>('JWT_SECRET');

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;
        //if no token
        if (!token) {
            return res.status(401).json({
                messageHu: 'Nincs token. Kérem jelentkezzen be.',
                messageEn: 'No token provided. Please log in.',
            });
        }

        //decode
        const decoded = JWT.verify(token, JWT_SECRET) as any;
        console.log(decoded);

        if (!decoded || !decoded.sid) {
            return res.status(401).json({
                messageHu: 'Érvénytelen token. Kérem jelentkezzen be újra.',
                messageEn: 'Invalid token. Please log in again.',
            });
        }
        const session = await container.sessionStore.getSession(decoded.sid);

        if (!session) {
            res.clearCookie('token');
            return res.status(401).json({
                messageHu: 'A munkamenet lejárt. Kérem jelentkezzen be újra.',
                messageEn: 'Session expired. Please log in again.',
            });
        }
        req.user = {
            id: session.userId,
            role: session.role,
            sessionId: decoded.sid,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            messageHu:
                'A munkamenet lejárt vagy érvénytelen. Kérem jelentkezzen be újra.',
            messageEn: 'Session expired or invalid. Please log in again.',
            error: (error as Error).message,
        });
    }
};

export default authMiddleware;
