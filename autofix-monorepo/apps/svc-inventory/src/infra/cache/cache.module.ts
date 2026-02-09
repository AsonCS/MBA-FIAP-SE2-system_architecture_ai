import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { ICacheService } from '../../core/ports/cache.service.interface';

/**
 * CacheModule
 * Configures Redis cache service
 */
@Module({
    providers: [
        {
            provide: 'ICacheService',
            useClass: RedisCacheService,
        },
    ],
    exports: ['ICacheService'],
})
export class CacheModule { }
