import { DomainEvent } from './domain-event.base';

/**
 * WorkOrderCreated Event
 * Published when a new work order is created
 */
export class WorkOrderCreatedEvent extends DomainEvent {
    constructor(
        public readonly workOrderId: string,
        public readonly tenantId: string,
        public readonly customerId: string,
        public readonly vehicleId: string,
    ) {
        super();
    }

    get eventName(): string {
        return 'WorkOrder.Created';
    }

    toJSON() {
        return {
            eventId: this.eventId,
            eventName: this.eventName,
            occurredOn: this.occurredOn.toISOString(),
            data: {
                workOrderId: this.workOrderId,
                tenantId: this.tenantId,
                customerId: this.customerId,
                vehicleId: this.vehicleId,
            },
        };
    }
}
