import { DomainEvent } from '../domain/events';

/**
 * IEventPublisher Port
 * Defines the contract for publishing domain events
 */
export interface IEventPublisher {
    /**
     * Publishes a single domain event
     */
    publish(event: DomainEvent): Promise<void>;

    /**
     * Publishes multiple domain events
     */
    publishAll(events: DomainEvent[]): Promise<void>;
}
