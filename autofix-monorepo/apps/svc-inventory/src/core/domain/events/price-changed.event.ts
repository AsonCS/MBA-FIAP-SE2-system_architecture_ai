import { DomainEvent } from './domain-event.base';

/**
 * PriceChanged Event
 * Triggered when product price is updated
 */
export class PriceChanged extends DomainEvent {
    constructor(
        public readonly sku: string,
        public readonly oldPrice: number,
        public readonly newPrice: number,
        public readonly currency: string,
    ) {
        super();
    }

    getEventName(): string {
        return 'PriceChanged';
    }
}
