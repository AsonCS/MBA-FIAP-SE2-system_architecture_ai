import { DomainEvent } from './domain-event.base';

/**
 * WorkOrderStatusChanged Event
 * Published when work order status changes
 */
export class WorkOrderStatusChangedEvent extends DomainEvent {
    constructor(
        public readonly workOrderId: string,
        public readonly previousStatus: string,
        public readonly newStatus: string,
        public readonly tenantId: string,
    ) {
        super();
    }

    get eventName(): string {
        return 'WorkOrder.StatusChanged';
    }

    toJSON() {
        return {
            eventId: this.eventId,
            eventName: this.eventName,
            occurredOn: this.occurredOn.toISOString(),
            data: {
                workOrderId: this.workOrderId,
                previousStatus: this.previousStatus,
                newStatus: this.newStatus,
                tenantId: this.tenantId,
            },
        };
    }
}
