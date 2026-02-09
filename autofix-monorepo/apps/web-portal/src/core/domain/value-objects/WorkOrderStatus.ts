/**
 * WorkOrderStatus Value Object
 * Implements a state machine for Work Order status transitions
 */

export enum WorkOrderStatusEnum {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export class WorkOrderStatus {
    private readonly _value: WorkOrderStatusEnum;

    private constructor(value: WorkOrderStatusEnum) {
        this._value = value;
    }

    /**
     * Valid state transitions
     */
    private static readonly VALID_TRANSITIONS: Record<
        WorkOrderStatusEnum,
        WorkOrderStatusEnum[]
    > = {
            [WorkOrderStatusEnum.OPEN]: [
                WorkOrderStatusEnum.IN_PROGRESS,
                WorkOrderStatusEnum.CANCELLED,
            ],
            [WorkOrderStatusEnum.IN_PROGRESS]: [
                WorkOrderStatusEnum.AWAITING_APPROVAL,
                WorkOrderStatusEnum.CANCELLED,
            ],
            [WorkOrderStatusEnum.AWAITING_APPROVAL]: [
                WorkOrderStatusEnum.APPROVED,
                WorkOrderStatusEnum.REJECTED,
                WorkOrderStatusEnum.CANCELLED,
            ],
            [WorkOrderStatusEnum.APPROVED]: [
                WorkOrderStatusEnum.IN_PROGRESS,
                WorkOrderStatusEnum.COMPLETED,
            ],
            [WorkOrderStatusEnum.REJECTED]: [
                WorkOrderStatusEnum.IN_PROGRESS,
                WorkOrderStatusEnum.CANCELLED,
            ],
            [WorkOrderStatusEnum.COMPLETED]: [],
            [WorkOrderStatusEnum.CANCELLED]: [],
        };

    /**
     * Status labels in Portuguese
     */
    private static readonly LABELS: Record<WorkOrderStatusEnum, string> = {
        [WorkOrderStatusEnum.OPEN]: 'Aberta',
        [WorkOrderStatusEnum.IN_PROGRESS]: 'Em Progresso',
        [WorkOrderStatusEnum.AWAITING_APPROVAL]: 'Aguardando Aprovação',
        [WorkOrderStatusEnum.APPROVED]: 'Aprovada',
        [WorkOrderStatusEnum.REJECTED]: 'Rejeitada',
        [WorkOrderStatusEnum.COMPLETED]: 'Concluída',
        [WorkOrderStatusEnum.CANCELLED]: 'Cancelada',
    };

    /**
     * Create status from enum value
     */
    static create(value: WorkOrderStatusEnum): WorkOrderStatus {
        return new WorkOrderStatus(value);
    }

    /**
     * Create status from string
     */
    static fromString(value: string): WorkOrderStatus {
        const enumValue = WorkOrderStatusEnum[value as keyof typeof WorkOrderStatusEnum];
        if (!enumValue) {
            throw new Error(`Invalid work order status: ${value}`);
        }
        return new WorkOrderStatus(enumValue);
    }

    /**
     * Create OPEN status
     */
    static open(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.OPEN);
    }

    /**
     * Get status value
     */
    get value(): WorkOrderStatusEnum {
        return this._value;
    }

    /**
     * Get status label in Portuguese
     */
    get label(): string {
        return WorkOrderStatus.LABELS[this._value];
    }

    /**
     * Check if transition to another status is valid
     */
    canTransitionTo(newStatus: WorkOrderStatus): boolean {
        const validTransitions = WorkOrderStatus.VALID_TRANSITIONS[this._value];
        return validTransitions.includes(newStatus._value);
    }

    /**
     * Transition to a new status
     */
    transitionTo(newStatus: WorkOrderStatus): WorkOrderStatus {
        if (!this.canTransitionTo(newStatus)) {
            throw new Error(
                `Invalid transition from ${this.label} to ${newStatus.label}`
            );
        }
        return newStatus;
    }

    /**
     * Check if status is terminal (cannot transition further)
     */
    isTerminal(): boolean {
        return (
            this._value === WorkOrderStatusEnum.COMPLETED ||
            this._value === WorkOrderStatusEnum.CANCELLED
        );
    }

    /**
     * Check if status is open
     */
    isOpen(): boolean {
        return this._value === WorkOrderStatusEnum.OPEN;
    }

    /**
     * Check if status is in progress
     */
    isInProgress(): boolean {
        return this._value === WorkOrderStatusEnum.IN_PROGRESS;
    }

    /**
     * Check if status is awaiting approval
     */
    isAwaitingApproval(): boolean {
        return this._value === WorkOrderStatusEnum.AWAITING_APPROVAL;
    }

    /**
     * Check if status is approved
     */
    isApproved(): boolean {
        return this._value === WorkOrderStatusEnum.APPROVED;
    }

    /**
     * Check if status is completed
     */
    isCompleted(): boolean {
        return this._value === WorkOrderStatusEnum.COMPLETED;
    }

    /**
     * Check if status is cancelled
     */
    isCancelled(): boolean {
        return this._value === WorkOrderStatusEnum.CANCELLED;
    }

    /**
     * Check equality
     */
    equals(other: WorkOrderStatus): boolean {
        return this._value === other._value;
    }

    /**
     * Convert to JSON
     */
    toJSON(): { value: string; label: string } {
        return {
            value: this._value,
            label: this.label,
        };
    }

    /**
     * String representation
     */
    toString(): string {
        return this._value;
    }
}
