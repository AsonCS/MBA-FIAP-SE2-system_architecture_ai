import { DomainEvent } from '../domain/events/domain-event.base';

/**
 * IEventPublisher Port
 * Interface for publishing domain events to message broker
 */
export interface IEventPublisher {
    /**
     * Publish a single domain event
     */
    publish(event: DomainEvent): Promise<void>;

    /**
     * Publish multiple domain events
     */
    publishAll(events: DomainEvent[]): Promise<void>;
}

/**
 * IEventHandler Port
 * Interface for handling external events
 */
export interface IEventHandler<T = any> {
    /**
     * Handle an event
     */
    handle(event: T): Promise<void>;

    /**
     * Get the event type this handler processes
     */
    getEventType(): string;
}
