import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification.module';
import { NotificationEntity, MessageTemplateEntity } from './infra/database/entities';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST', 'localhost'),
                port: configService.get('DB_PORT', 5432),
                username: configService.get('DB_USERNAME', 'postgres'),
                password: configService.get('DB_PASSWORD', 'postgres'),
                database: configService.get('DB_DATABASE', 'notification_db'),
                entities: [NotificationEntity, MessageTemplateEntity],
                synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
                logging: configService.get('DB_LOGGING', 'false') === 'true',
            }),
            inject: [ConfigService],
        }),
        NotificationModule,
    ],
})
export class AppModule { }
