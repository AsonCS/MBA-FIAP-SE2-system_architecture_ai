import { Module, forwardRef } from '@nestjs/common';
import { KafkaEventPublisher } from './kafka-event-publisher.service';
import { WorkOrderApprovedHandler } from './handlers/work-order-approved.handler';
import { WorkOrderCompletedHandler } from './handlers/work-order-completed.handler';
import { ApplicationModule } from '../../core/application/application.module';

/**
 * MessagingModule
 * Configures Kafka event publisher and consumers
 */
@Module({
    imports: [forwardRef(() => ApplicationModule)],
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
