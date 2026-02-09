import { DomainEvent } from './domain-event.base';

/**
 * WorkOrderCompleted Event
 * Published when a work order is completed
 * This event triggers inventory deduction in svc-inventory
 */
export class WorkOrderCompletedEvent extends DomainEvent {
    constructor(
        public readonly workOrderId: string,
        public readonly tenantId: string,
        public readonly totalAmount: number, // in cents
        public readonly items: Array<{
            itemId: string;
            type: 'PART' | 'SERVICE';
            sku?: string;
            quantity: number;
        }>,
    ) {
        super();
    }

    get eventName(): string {
        return 'WorkOrder.Completed';
    }

    toJSON() {
        return {
            eventId: this.eventId,
            eventName: this.eventName,
            occurredOn: this.occurredOn.toISOString(),
            data: {
                workOrderId: this.workOrderId,
                tenantId: this.tenantId,
                totalAmount: this.totalAmount,
                items: this.items,
            },
        };
    }
}
