import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { NotificationEntity, MessageTemplateEntity } from './infra/database/entities';

// Repositories
import { TypeOrmNotificationRepository, TypeOrmTemplateRepository } from './infra/database/repositories';

// Providers
import {
    AwsSesMailProvider,
    TwilioSmsProvider,
    TwilioWhatsAppProvider,
    FirebasePushProvider,
} from './infra/providers';

// Domain Services
import { TemplateEngine } from './core/domain/services';

// Application Handlers
import {
    SendNotificationHandler,
    SendWelcomeEmailHandler,
    NotifyOrderStatusHandler,
    SendPasswordRecoveryHandler,
} from './core/application/handlers';

// Messaging Consumers
import {
    UserRegisteredConsumer,
    WorkOrderStatusChangedConsumer,
    PasswordRecoveryRequestedConsumer,
} from './infra/messaging/consumers';

// Ports
import {
    INotificationRepository,
    ITemplateRepository,
    IMailGateway,
    ISmsGateway,
    IWhatsAppGateway,
    IPushGateway,
} from './core/ports';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([NotificationEntity, MessageTemplateEntity]),
    ],
    providers: [
        // Domain Services
        TemplateEngine,

        // Repositories
        {
            provide: 'INotificationRepository',
            useClass: TypeOrmNotificationRepository,
        },
        {
            provide: 'ITemplateRepository',
            useClass: TypeOrmTemplateRepository,
        },

        // Gateway Providers
        {
            provide: 'IMailGateway',
            useClass: AwsSesMailProvider,
        },
        {
            provide: 'ISmsGateway',
            useClass: TwilioSmsProvider,
        },
        {
            provide: 'IWhatsAppGateway',
            useClass: TwilioWhatsAppProvider,
        },
        {
            provide: 'IPushGateway',
            useClass: FirebasePushProvider,
        },

        // Application Handlers
        {
            provide: SendNotificationHandler,
            useFactory: (
                notificationRepo: INotificationRepository,
                templateRepo: ITemplateRepository,
                templateEngine: TemplateEngine,
                mailGateway: IMailGateway,
                smsGateway: ISmsGateway,
                whatsAppGateway: IWhatsAppGateway,
                pushGateway: IPushGateway,
            ) => {
                return new SendNotificationHandler(
                    notificationRepo,
                    templateRepo,
                    templateEngine,
                    mailGateway,
                    smsGateway,
                    whatsAppGateway,
                    pushGateway,
                );
            },
            inject: [
                'INotificationRepository',
                'ITemplateRepository',
                TemplateEngine,
                'IMailGateway',
                'ISmsGateway',
                'IWhatsAppGateway',
                'IPushGateway',
            ],
        },
        {
            provide: SendWelcomeEmailHandler,
            useFactory: (sendNotificationHandler: SendNotificationHandler) => {
                return new SendWelcomeEmailHandler(sendNotificationHandler);
            },
            inject: [SendNotificationHandler],
        },
        {
            provide: NotifyOrderStatusHandler,
            useFactory: (sendNotificationHandler: SendNotificationHandler) => {
                return new NotifyOrderStatusHandler(sendNotificationHandler);
            },
            inject: [SendNotificationHandler],
        },
        {
            provide: SendPasswordRecoveryHandler,
            useFactory: (sendNotificationHandler: SendNotificationHandler) => {
                return new SendPasswordRecoveryHandler(sendNotificationHandler);
            },
            inject: [SendNotificationHandler],
        },

        // Kafka Consumers
        UserRegisteredConsumer,
        WorkOrderStatusChangedConsumer,
        PasswordRecoveryRequestedConsumer,
    ],
    exports: [
        SendNotificationHandler,
        SendWelcomeEmailHandler,
        NotifyOrderStatusHandler,
        SendPasswordRecoveryHandler,
    ],
})
export class NotificationModule { }
