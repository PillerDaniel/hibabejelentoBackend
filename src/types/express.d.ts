export {};

//include user to request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                sessionId: string;
            };
        }
    }
}
