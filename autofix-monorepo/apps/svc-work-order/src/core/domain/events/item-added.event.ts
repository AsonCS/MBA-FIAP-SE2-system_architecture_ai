import { DomainEvent } from './domain-event.base';

/**
 * ItemAdded Event
 * Published when an item is added to a work order
 */
export class ItemAddedEvent extends DomainEvent {
    constructor(
        public readonly workOrderId: string,
        public readonly itemId: string,
        public readonly itemType: 'PART' | 'SERVICE',
        public readonly description: string,
    ) {
        super();
    }

    get eventName(): string {
        return 'WorkOrder.ItemAdded';
    }

    toJSON() {
        return {
            eventId: this.eventId,
            eventName: this.eventName,
            occurredOn: this.occurredOn.toISOString(),
            data: {
                workOrderId: this.workOrderId,
                itemId: this.itemId,
                itemType: this.itemType,
                description: this.description,
            },
        };
    }
}
