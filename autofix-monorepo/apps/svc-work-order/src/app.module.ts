import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { WorkOrderEntity, OutboxEntity } from './infra/database/entities';
import {
    TypeOrmWorkOrderRepository,
    TypeOrmOutboxRepository,
} from './infra/database/repositories';
import {
    HttpInventoryAdapter,
    KafkaEventPublisher,
} from './infra/adapters';
import { OutboxWorker } from './infra/workers';
import { WorkOrderController } from './infra/http/controllers';
import {
    CreateWorkOrderCommand,
    AddPartItemCommand,
    AddServiceItemCommand,
    CompleteWorkOrderCommand,
} from './core/application/commands';
import {
    GetWorkOrderQuery,
    ListWorkOrdersQuery,
} from './core/application/queries';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'work_order_db',
            entities: [WorkOrderEntity, OutboxEntity],
            synchronize: process.env.NODE_ENV !== 'production', // Disable in production
            logging: process.env.NODE_ENV === 'development',
        }),
        TypeOrmModule.forFeature([WorkOrderEntity, OutboxEntity]),
        HttpModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [WorkOrderController],
    providers: [
        // Repositories
        {
            provide: 'IWorkOrderRepository',
            useClass: TypeOrmWorkOrderRepository,
        },
        {
            provide: 'IOutboxRepository',
            useClass: TypeOrmOutboxRepository,
        },
        // Adapters
        {
            provide: 'IInventoryGateway',
            useClass: HttpInventoryAdapter,
        },
        {
            provide: 'IEventPublisher',
            useClass: KafkaEventPublisher,
        },
        // Commands
        {
            provide: CreateWorkOrderCommand,
            useFactory: (workOrderRepo, outboxRepo) =>
                new CreateWorkOrderCommand(workOrderRepo, outboxRepo),
            inject: ['IWorkOrderRepository', 'IOutboxRepository'],
        },
        {
            provide: AddPartItemCommand,
            useFactory: (workOrderRepo, inventoryGateway, outboxRepo) =>
                new AddPartItemCommand(workOrderRepo, inventoryGateway, outboxRepo),
            inject: ['IWorkOrderRepository', 'IInventoryGateway', 'IOutboxRepository'],
        },
        {
            provide: AddServiceItemCommand,
            useFactory: (workOrderRepo, outboxRepo) =>
                new AddServiceItemCommand(workOrderRepo, outboxRepo),
            inject: ['IWorkOrderRepository', 'IOutboxRepository'],
        },
        {
            provide: CompleteWorkOrderCommand,
            useFactory: (workOrderRepo, outboxRepo) =>
                new CompleteWorkOrderCommand(workOrderRepo, outboxRepo),
            inject: ['IWorkOrderRepository', 'IOutboxRepository'],
        },
        // Queries
        {
            provide: GetWorkOrderQuery,
            useFactory: (workOrderRepo) => new GetWorkOrderQuery(workOrderRepo),
            inject: ['IWorkOrderRepository'],
        },
        {
            provide: ListWorkOrdersQuery,
            useFactory: (workOrderRepo) => new ListWorkOrdersQuery(workOrderRepo),
            inject: ['IWorkOrderRepository'],
        },
        // Workers
        {
            provide: OutboxWorker,
            useFactory: (outboxRepo, eventPublisher) =>
                new OutboxWorker(outboxRepo, eventPublisher),
            inject: ['IOutboxRepository', 'IEventPublisher'],
        },
        // Infrastructure
        TypeOrmWorkOrderRepository,
        TypeOrmOutboxRepository,
        HttpInventoryAdapter,
        KafkaEventPublisher,
    ],
})
export class AppModule { }
