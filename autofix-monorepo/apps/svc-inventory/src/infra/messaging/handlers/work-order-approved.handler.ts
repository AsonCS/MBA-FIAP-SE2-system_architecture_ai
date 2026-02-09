import { Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../core/ports/event.interface';
import { ReserveStockHandler } from '../../../core/application/commands/reserve-stock.handler';
import { ReserveStockCommand } from '../../../core/application/commands/reserve-stock.command';

/**
 * WorkOrderApprovedEvent
 * External event from svc-work-order
 */
interface WorkOrderApprovedEvent {
    workOrderId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    approvedAt: string;
}

/**
 * WorkOrderApprovedHandler
 * Handles WorkOrder.Approved events from Kafka
 */
@Injectable()
export class WorkOrderApprovedHandler implements IEventHandler<WorkOrderApprovedEvent> {
    private readonly logger = new Logger(WorkOrderApprovedHandler.name);
    private readonly processedEvents = new Set<string>();

    constructor(private readonly reserveStockHandler: ReserveStockHandler) { }

    getEventType(): string {
        return 'WorkOrder.Approved';
    }

    async handle(event: WorkOrderApprovedEvent & { eventId?: string }): Promise<void> {
        // Idempotency check
        if (event.eventId && this.processedEvents.has(event.eventId)) {
            this.logger.warn(`Event ${event.eventId} already processed, skipping`);
            return;
        }

        this.logger.log(`Processing WorkOrder.Approved: ${event.workOrderId}`);

        try {
            // Reserve stock for each item in the work order
            for (const item of event.items) {
                const command = new ReserveStockCommand(
                    item.sku,
                    item.quantity,
                    event.workOrderId,
                );

                await this.reserveStockHandler.execute(command);
                this.logger.log(
                    `Reserved ${item.quantity} units of ${item.sku} for work order ${event.workOrderId}`,
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
                `Error processing WorkOrder.Approved ${event.workOrderId}:`,
                error,
            );
            throw error;
        }
    }
}
