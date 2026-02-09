import { Injectable } from '@nestjs/common';
import { ICacheService } from '../../../core/ports/cache.service.interface';
import Redis from 'ioredis';

/**
 * RedisCacheService
 * Implementation of ICacheService using Redis
 */
@Injectable()
export class RedisCacheService implements ICacheService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0'),
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as T;
        } catch {
            return value as T;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const serialized = JSON.stringify(value);

        if (ttlSeconds) {
            await this.client.setex(key, ttlSeconds, serialized);
        } else {
            await this.client.set(key, serialized);
        }
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async deletePattern(pattern: string): Promise<void> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
