import { Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../core/ports/event.interface';
import { ConsumeStockHandler } from '../../../core/application/commands/consume-stock.handler';
import { ConsumeStockCommand } from '../../../core/application/commands/consume-stock.command';

/**
 * WorkOrderCompletedEvent
 * External event from svc-work-order
 */
interface WorkOrderCompletedEvent {
    workOrderId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    completedBy: string;
    completedAt: string;
}

/**
 * WorkOrderCompletedHandler
 * Handles WorkOrder.Completed events from Kafka
 */
@Injectable()
export class WorkOrderCompletedHandler implements IEventHandler<WorkOrderCompletedEvent> {
    private readonly logger = new Logger(WorkOrderCompletedHandler.name);
    private readonly processedEvents = new Set<string>();

    constructor(private readonly consumeStockHandler: ConsumeStockHandler) { }

    getEventType(): string {
        return 'WorkOrder.Completed';
    }

    async handle(event: WorkOrderCompletedEvent & { eventId?: string }): Promise<void> {
        // Idempotency check
        if (event.eventId && this.processedEvents.has(event.eventId)) {
            this.logger.warn(`Event ${event.eventId} already processed, skipping`);
            return;
        }

        this.logger.log(`Processing WorkOrder.Completed: ${event.workOrderId}`);

        try {
            // Consume stock for each item in the work order
            for (const item of event.items) {
                const command = new ConsumeStockCommand(
                    item.sku,
                    item.quantity,
                    event.workOrderId,
                    event.completedBy,
                );

                await this.consumeStockHandler.execute(command);
                this.logger.log(
                    `Consumed ${item.quantity} units of ${item.sku} for work order ${event.workOrderId}`,
                );
            }

            // Mark event as processed
            if (event.eventId) {
                this.processedEvents.add(event.eventId);
                // Clean up old events (keep last 1000)
                if (this.processedEvents.size > 1000) {
                    const toDelete = Array.from(this.processedEvents).slice(0, 100);
                    toDelete.forEach((id) => this.processedEvents.delete(id));
                }
            }
        } catch (error) {
            this.logger.error(
                `Error processing WorkOrder.Completed ${event.workOrderId}:`,
                error,
            );
            throw error;
        }
    }
}
