/**
 * StockMovement Entity
 * Immutable record of stock changes (Kardex)
 */
export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
}

export enum MovementReason {
    PURCHASE = 'PURCHASE',
    WORK_ORDER = 'WORK_ORDER',
    ADJUSTMENT = 'ADJUSTMENT',
    RETURN = 'RETURN',
    TRANSFER = 'TRANSFER',
    DAMAGE = 'DAMAGE',
}

export interface StockMovementProps {
    id: string;
    sku: string;
    type: MovementType;
    reason: MovementReason;
    quantity: number;
    balanceAfter: number;
    cost?: number;
    reference?: string; // e.g., WorkOrder ID, Invoice Number
    notes?: string;
    createdBy: string;
    createdAt: Date;
}

export class StockMovement {
    private readonly props: StockMovementProps;

    private constructor(props: StockMovementProps) {
        this.props = { ...props };
    }

    static create(props: Omit<StockMovementProps, 'id' | 'createdAt'>): StockMovement {
        return new StockMovement({
            ...props,
            id: this.generateId(),
            createdAt: new Date(),
        });
    }

    static reconstitute(props: StockMovementProps): StockMovement {
        return new StockMovement(props);
    }

    private static generateId(): string {
        return `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getId(): string {
        return this.props.id;
    }

    getSku(): string {
        return this.props.sku;
    }

    getType(): MovementType {
        return this.props.type;
    }

    getReason(): MovementReason {
        return this.props.reason;
    }

    getQuantity(): number {
        return this.props.quantity;
    }

    getBalanceAfter(): number {
        return this.props.balanceAfter;
    }

    getCost(): number | undefined {
        return this.props.cost;
    }

    getReference(): string | undefined {
        return this.props.reference;
    }

    getNotes(): string | undefined {
        return this.props.notes;
    }

    getCreatedBy(): string {
        return this.props.createdBy;
    }

    getCreatedAt(): Date {
        return this.props.createdAt;
    }

    toJSON(): StockMovementProps {
        return { ...this.props };
    }
}
