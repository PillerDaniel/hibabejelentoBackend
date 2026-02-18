import { randomUUID } from 'crypto';
import {
    ISessionStore,
    SessionData,
} from '../domain/iRepositories/ISessionStore';
import { getRedisClient } from '../utils/connectRedis';

export class RedisSessionStore implements ISessionStore {
    private ttlSeconds: number;

    constructor(ttlSeconds = 60 * 60 * 24 * 7) {
        this.ttlSeconds = ttlSeconds;
    }

    async createSession(userId: string, role: string): Promise<string> {
        const sid = randomUUID();
        const key = `session:${sid}`;

        const sessionData: SessionData = {
            userId,
            role,
            createdAt: new Date().toISOString(),
        };
        const client = getRedisClient();
        await client.setEx(key, this.ttlSeconds, JSON.stringify(sessionData));
        return sid;
    }

    async getSession(sid: string): Promise<string | null> {
        const key = `session:${sid}`;
        const client = getRedisClient();
        const sessionData = await client.get(key);
        return sessionData;
    }

    async deleteSession(sid: string): Promise<void> {
        const client = getRedisClient();
        await client.del(`session:${sid}`);
    }
}
