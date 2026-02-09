import { Module } from '@nestjs/common';
import { KafkaEventPublisher } from './kafka-event-publisher.service';
import { WorkOrderApprovedHandler } from './handlers/work-order-approved.handler';
import { WorkOrderCompletedHandler } from './handlers/work-order-completed.handler';
import { IEventPublisher } from '../../core/ports/event.interface';

/**
 * MessagingModule
 * Configures Kafka event publisher and consumers
 */
@Module({
    providers: [
        {
            provide: 'IEventPublisher',
            useClass: KafkaEventPublisher,
        },
        WorkOrderApprovedHandler,
        WorkOrderCompletedHandler,
    ],
    exports: ['IEventPublisher', WorkOrderApprovedHandler, WorkOrderCompletedHandler],
})
export class MessagingModule { }
