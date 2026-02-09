import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Redis } from 'ioredis';
import { Kafka } from 'kafkajs';

// Entities
import { UserEntity } from './infra/database/entities/user.entity';
import { TenantEntity } from './infra/database/entities/tenant.entity';

// Repositories
import { TypeOrmUserRepository } from './infra/database/repositories/typeorm-user.repository';
import { TypeOrmTenantRepository } from './infra/database/repositories/typeorm-tenant.repository';
import { RedisRefreshTokenRepository } from './infra/cache/redis-refresh-token.repository';

// Services
import { BcryptHasher } from './infra/cryptography/bcrypt-hasher.service';
import { JwtTokenService } from './infra/cryptography/jwt-token.service';
import { KafkaEventPublisher } from './infra/messaging/kafka-event-publisher.service';

// Use Cases
import { LoginUseCase } from './core/application/login.usecase';
import { CreateTenantUseCase } from './core/application/create-tenant.usecase';
import { RefreshTokenUseCase } from './core/application/refresh-token.usecase';
import { LogoutUseCase } from './core/application/logout.usecase';

// Controllers
import { AuthController } from './infra/api/controllers/auth.controller';

// Guards & Strategies
import { JwtStrategy } from './infra/api/guards/jwt.strategy';
import { JwtAuthGuard } from './infra/api/guards/jwt-auth.guard';

// Filters
import { GlobalExceptionFilter } from './infra/api/filters/global-exception.filter';

// Port Tokens
const USER_REPOSITORY = 'IUserRepository';
const TENANT_REPOSITORY = 'ITenantRepository';
const HASHER = 'IHasher';
const TOKEN_SERVICE = 'ITokenService';
const REFRESH_TOKEN_REPOSITORY = 'IRefreshTokenRepository';
const EVENT_PUBLISHER = 'IEventPublisher';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST', 'localhost'),
                port: config.get('DB_PORT', 5432),
                username: config.get('DB_USERNAME', 'postgres'),
                password: config.get('DB_PASSWORD', 'postgres'),
                database: config.get('DB_DATABASE', 'auth_db'),
                entities: [UserEntity, TenantEntity],
                synchronize: config.get('DB_SYNC', true),
            }),
        }),
        TypeOrmModule.forFeature([UserEntity, TenantEntity]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET', 'your-secret-key'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        // Redis Client
        {
            provide: 'REDIS_CLIENT',
            useFactory: (config: ConfigService) => {
                return new Redis({
                    host: config.get('REDIS_HOST', 'localhost'),
                    port: config.get('REDIS_PORT', 6379),
                });
            },
            inject: [ConfigService],
        },
        // Kafka Client
        {
            provide: 'KAFKA_CLIENT',
            useFactory: (config: ConfigService) => {
                return new Kafka({
                    clientId: 'svc-auth',
                    brokers: [config.get('KAFKA_BROKER', 'localhost:9092')],
                });
            },
            inject: [ConfigService],
        },
        // Repositories
        {
            provide: USER_REPOSITORY,
            useClass: TypeOrmUserRepository,
        },
        {
            provide: TENANT_REPOSITORY,
            useClass: TypeOrmTenantRepository,
        },
        {
            provide: REFRESH_TOKEN_REPOSITORY,
            useClass: RedisRefreshTokenRepository,
        },
        // Services
        {
            provide: HASHER,
            useClass: BcryptHasher,
        },
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenService,
        },
        {
            provide: EVENT_PUBLISHER,
            useClass: KafkaEventPublisher,
        },
        // Use Cases
        {
            provide: LoginUseCase,
            useFactory: (userRepo, hasher, tokenService, refreshTokenRepo) => {
                return new LoginUseCase(userRepo, hasher, tokenService, refreshTokenRepo);
            },
            inject: [USER_REPOSITORY, HASHER, TOKEN_SERVICE, REFRESH_TOKEN_REPOSITORY],
        },
        {
            provide: CreateTenantUseCase,
            useFactory: (tenantRepo, userRepo, hasher, eventPublisher) => {
                return new CreateTenantUseCase(tenantRepo, userRepo, hasher, eventPublisher);
            },
            inject: [TENANT_REPOSITORY, USER_REPOSITORY, HASHER, EVENT_PUBLISHER],
        },
        {
            provide: RefreshTokenUseCase,
            useFactory: (tokenService, refreshTokenRepo) => {
                return new RefreshTokenUseCase(tokenService, refreshTokenRepo);
            },
            inject: [TOKEN_SERVICE, REFRESH_TOKEN_REPOSITORY],
        },
        {
            provide: LogoutUseCase,
            useFactory: (refreshTokenRepo, tokenService) => {
                return new LogoutUseCase(refreshTokenRepo, tokenService);
            },
            inject: [REFRESH_TOKEN_REPOSITORY, TOKEN_SERVICE],
        },
        // Guards & Strategies
        JwtStrategy,
        JwtAuthGuard,
        // Filters
        GlobalExceptionFilter,
    ],
})
export class AppModule { }
