/**
 * Base Domain Event
 */
export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventId: string;

    protected constructor() {
        this.occurredOn = new Date();
        this.eventId = this.generateEventId();
    }

    private generateEventId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    abstract get eventName(): string;
    abstract toJSON(): any;
}
