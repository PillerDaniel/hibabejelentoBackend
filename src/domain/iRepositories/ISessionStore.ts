export interface ISessionStore {
    createSession(userId: string, role: string): Promise<string>;
    deleteSession(sid: string): Promise<void>;
    getSession(sid: string): Promise<string | null>;
}

export type SessionData = {
    userId: string;
    role: string;
    createdAt: string;
};
