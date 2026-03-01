import { randomUUID } from 'crypto';
import {
    ISessionStore,
    SessionData,
} from '../domain/iRepositories/ISessionStore';
import { getRedisClient } from '../application/utils/connectRedis';

export class RedisSessionStore implements ISessionStore {
    private ttlSeconds: number;

    constructor(ttlSeconds = 60 * 60) {
        this.ttlSeconds = ttlSeconds;
    }

    private key(sid: string) {
        return `session:${sid}`;
    }

    async createSession(
        userId: string,
        role: string,
        username: string
    ): Promise<string> {
        const sid = randomUUID();

        const sessionData: SessionData = {
            userId,
            username,
            role,
            createdAt: new Date().toISOString(),
        };
        const client = getRedisClient();
        await client.setEx(
            this.key(sid),
            this.ttlSeconds,
            JSON.stringify(sessionData)
        );
        return sid;
    }

    async getSession(sid: string): Promise<SessionData | null> {
        const client = getRedisClient();
        const raw = await client.get(this.key(sid));
        return JSON.parse(raw || 'null') as SessionData | null;
    }

    async deleteSession(sid: string): Promise<void> {
        const client = getRedisClient();
        await client.del(this.key(sid));
    }
}
