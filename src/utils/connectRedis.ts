import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

const connectRedis = async (redisUrl: string): Promise<RedisClientType> => {
    if (client && client.isOpen) {
        return client;
    }

    client = createClient({ url: redisUrl });

    client.on('error', (err: any) => console.error('Redis client error:', err));

    await client.connect();
    console.log('Connected to Redis');
    return client;
};

const getRedisClient = (): RedisClientType => {
    if (!client) {
        throw new Error('Redis client is not connected.');
    }
    return client;
};

export { connectRedis, getRedisClient };
