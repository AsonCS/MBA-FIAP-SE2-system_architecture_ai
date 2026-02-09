export interface DomainEvent {
    occurredOn: Date;
    getAggregateId(): string;
}

export class UserRegisteredEvent implements DomainEvent {
    public readonly occurredOn: Date;

    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly name: string,
        public readonly tenantId: string,
    ) {
        this.occurredOn = new Date();
    }

    getAggregateId(): string {
        return this.userId;
    }
}

export class TenantCreatedEvent implements DomainEvent {
    public readonly occurredOn: Date;

    constructor(
        public readonly tenantId: string,
        public readonly name: string,
        public readonly cnpj: string,
    ) {
        this.occurredOn = new Date();
    }

    getAggregateId(): string {
        return this.tenantId;
    }
}

export class UserDeletedEvent implements DomainEvent {
    public readonly occurredOn: Date;

    constructor(
        public readonly userId: string,
        public readonly tenantId: string,
    ) {
        this.occurredOn = new Date();
    }

    getAggregateId(): string {
        return this.userId;
    }
}
