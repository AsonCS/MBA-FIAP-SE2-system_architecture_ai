import { DomainEvent } from './domain-event.base';

/**
 * LowStockDetected Event
 * Triggered when product stock falls below minimum threshold
 */
export class LowStockDetected extends DomainEvent {
    constructor(
        public readonly sku: string,
        public readonly currentStock: number,
        public readonly minStockLevel: number,
    ) {
        super();
    }

    getEventName(): string {
        return 'LowStockDetected';
    }
}
