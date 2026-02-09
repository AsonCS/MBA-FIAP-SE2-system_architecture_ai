import { DomainEvent } from './domain-event.base';

/**
 * StockAdjusted Event
 * Triggered for manual stock corrections or audits
 */
export class StockAdjusted extends DomainEvent {
    constructor(
        public readonly sku: string,
        public readonly previousQuantity: number,
        public readonly newQuantity: number,
        public readonly reason: string,
        public readonly adjustedBy: string,
    ) {
        super();
    }

    getEventName(): string {
        return 'StockAdjusted';
    }
}
