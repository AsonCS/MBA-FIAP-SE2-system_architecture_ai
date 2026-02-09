import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IRefreshTokenRepository } from '@core/ports/refresh-token-repository.port';

@Injectable()
export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) { }

    async save(userId: string, token: string, ttl: number): Promise<void> {
        const key = `refresh_token:${userId}`;
        await this.redis.setex(key, ttl, token);
    }

    async find(userId: string): Promise<string | null> {
        const key = `refresh_token:${userId}`;
        return this.redis.get(key);
    }

    async delete(userId: string): Promise<void> {
        const key = `refresh_token:${userId}`;
        await this.redis.del(key);
    }

    async isRevoked(token: string): Promise<boolean> {
        const key = `blocklist:${token}`;
        const result = await this.redis.exists(key);
        return result === 1;
    }

    async revoke(token: string, ttl: number): Promise<void> {
        const key = `blocklist:${token}`;
        await this.redis.setex(key, ttl, '1');
    }
}
