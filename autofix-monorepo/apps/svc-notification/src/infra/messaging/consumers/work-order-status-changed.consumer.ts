import { Injectable, Logger } from '@nestjs/common';
import { NotifyOrderStatusHandler } from '../../../core/application/handlers';

@Injectable()
export class WorkOrderStatusChangedConsumer {
    private readonly logger = new Logger(WorkOrderStatusChangedConsumer.name);

    constructor(private readonly notifyOrderStatusHandler: NotifyOrderStatusHandler) { }

    async consume(message: any): Promise<void> {
        try {
            const event = JSON.parse(message.value.toString());

            this.logger.log(`Processing WorkOrderStatusChanged event for order: ${event.orderId}`);

            await this.notifyOrderStatusHandler.handle({
                orderId: event.orderId,
                customerPhone: event.customerPhone,
                customerName: event.customerName,
                status: event.status,
                estimatedCompletion: event.estimatedCompletion ? new Date(event.estimatedCompletion) : undefined,
            });

            this.logger.log(`Successfully sent order status notification for: ${event.orderId}`);
        } catch (error) {
            this.logger.error(`Failed to process WorkOrderStatusChanged event: ${error.message}`, error.stack);

            if (error.retryable) {
                throw error;
            }

            this.logger.warn(`Non-retryable error, skipping message: ${error.message}`);
        }
    }
}
