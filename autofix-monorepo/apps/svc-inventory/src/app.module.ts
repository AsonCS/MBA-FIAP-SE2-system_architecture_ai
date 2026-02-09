import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database/database.module';
import { CacheModule } from './infra/cache/cache.module';
import { MessagingModule } from './infra/messaging/messaging.module';
import { ApplicationModule } from './core/application/application.module';
import { InventoryController } from './infra/api/controllers/inventory.controller';
import { HealthController } from './infra/api/controllers/health.controller';

/**
 * AppModule
 * Main application module
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'inventory',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production', // Only for development
            logging: process.env.NODE_ENV === 'development',
        }),
        DatabaseModule,
        CacheModule,
        MessagingModule,
        ApplicationModule,
    ],
    controllers: [InventoryController, HealthController],
})
export class AppModule { }
