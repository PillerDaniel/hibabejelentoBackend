import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !requiredRole.includes(userRole)) {
            return res.status(403).json({
                messageHu: 'Hozzáférés megtagadva',
                messageEn: 'Access denied',
            });
        }

        next();
    };
};

export default roleMiddleware;
