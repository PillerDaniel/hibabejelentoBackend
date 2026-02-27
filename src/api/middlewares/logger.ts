import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../../application/utils/bot';

const logger = async (req: Request, res: Response, next: NextFunction) => {
    await logRequest(req.url, req.method);
    next();
};

export default logger;
