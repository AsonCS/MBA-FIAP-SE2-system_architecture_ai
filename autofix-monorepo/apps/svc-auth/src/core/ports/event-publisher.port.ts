import { DomainEvent } from '../domain/events/domain-events';

export interface IEventPublisher {
    publish(event: DomainEvent): Promise<void>;
    publishMany(events: DomainEvent[]): Promise<void>;
}
