import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../../application/utils/bot';

const logger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.on('finish', () => {
            const userId = req.user?.id || 'No User';
            const status = res.statusCode;

            logRequest(req.originalUrl, req.method, status, userId);
        });

        next();
    } catch (error) {
        console.error('Error logging request:', error);
        next();
    }
};

export default logger;
