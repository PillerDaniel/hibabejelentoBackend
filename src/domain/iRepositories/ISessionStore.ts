export interface ISessionStore {
    createSession(
        userId: string,
        role: string,
        username: string
    ): Promise<string>;
    deleteSession(sid: string): Promise<void>;
    getSession(sid: string): Promise<SessionData | null>;
}

export type SessionData = {
    userId: string;
    role: string;
    username: string;
    createdAt: string;
};
