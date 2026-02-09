import { CNPJ } from '../value-objects/cnpj.vo';
import { UserAggregate } from './user.aggregate';

export enum TenantStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    INACTIVE = 'INACTIVE',
}

export interface TenantProps {
    id: string;
    name: string;
    cnpj: CNPJ;
    status: TenantStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class TenantAggregate {
    private props: TenantProps;
    private ownerUser?: UserAggregate;

    private constructor(props: TenantProps) {
        this.props = props;
    }

    static create(props: Omit<TenantProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): TenantAggregate {
        const now = new Date();
        return new TenantAggregate({
            ...props,
            id: this.generateId(),
            status: TenantStatus.ACTIVE,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: TenantProps): TenantAggregate {
        return new TenantAggregate(props);
    }

    private static generateId(): string {
        return `tenant_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get cnpj(): CNPJ {
        return this.props.cnpj;
    }

    get status(): TenantStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // Business Methods
    changeStatus(status: TenantStatus): void {
        this.props.status = status;
        this.props.updatedAt = new Date();
    }

    suspend(): void {
        this.changeStatus(TenantStatus.SUSPENDED);
    }

    activate(): void {
        this.changeStatus(TenantStatus.ACTIVE);
    }

    deactivate(): void {
        this.changeStatus(TenantStatus.INACTIVE);
    }

    setOwner(owner: UserAggregate): void {
        this.ownerUser = owner;
    }

    getOwner(): UserAggregate | undefined {
        return this.ownerUser;
    }

    hasOwner(): boolean {
        return this.ownerUser !== undefined;
    }
}
