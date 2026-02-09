/**
 * WorkOrderStatus Value Object
 * Implements a strict state machine for work order lifecycle
 */
export enum WorkOrderStatusEnum {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

export class WorkOrderStatus {
    private readonly _value: WorkOrderStatusEnum;

    private constructor(value: WorkOrderStatusEnum) {
        this._value = value;
    }

    static draft(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.DRAFT);
    }

    static pendingApproval(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.PENDING_APPROVAL);
    }

    static approved(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.APPROVED);
    }

    static inProgress(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.IN_PROGRESS);
    }

    static completed(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.COMPLETED);
    }

    static canceled(): WorkOrderStatus {
        return new WorkOrderStatus(WorkOrderStatusEnum.CANCELED);
    }

    static fromString(value: string): WorkOrderStatus {
        if (!Object.values(WorkOrderStatusEnum).includes(value as WorkOrderStatusEnum)) {
            throw new Error(`Invalid work order status: ${value}`);
        }
        return new WorkOrderStatus(value as WorkOrderStatusEnum);
    }

    get value(): WorkOrderStatusEnum {
        return this._value;
    }

    /**
     * Validates if transition to new status is allowed
     * Implements strict state machine rules
     */
    canTransitionTo(newStatus: WorkOrderStatus): boolean {
        const transitions: Record<WorkOrderStatusEnum, WorkOrderStatusEnum[]> = {
            [WorkOrderStatusEnum.DRAFT]: [
                WorkOrderStatusEnum.PENDING_APPROVAL,
                WorkOrderStatusEnum.CANCELED,
            ],
            [WorkOrderStatusEnum.PENDING_APPROVAL]: [
                WorkOrderStatusEnum.APPROVED,
                WorkOrderStatusEnum.DRAFT,
                WorkOrderStatusEnum.CANCELED,
            ],
            [WorkOrderStatusEnum.APPROVED]: [
                WorkOrderStatusEnum.IN_PROGRESS,
                WorkOrderStatusEnum.CANCELED,
            ],
            [WorkOrderStatusEnum.IN_PROGRESS]: [
                WorkOrderStatusEnum.COMPLETED,
                WorkOrderStatusEnum.CANCELED,
            ],
            [WorkOrderStatusEnum.COMPLETED]: [],
            [WorkOrderStatusEnum.CANCELED]: [],
        };

        return transitions[this._value].includes(newStatus._value);
    }

    isDraft(): boolean {
        return this._value === WorkOrderStatusEnum.DRAFT;
    }

    isPendingApproval(): boolean {
        return this._value === WorkOrderStatusEnum.PENDING_APPROVAL;
    }

    isApproved(): boolean {
        return this._value === WorkOrderStatusEnum.APPROVED;
    }

    isInProgress(): boolean {
        return this._value === WorkOrderStatusEnum.IN_PROGRESS;
    }

    isCompleted(): boolean {
        return this._value === WorkOrderStatusEnum.COMPLETED;
    }

    isCanceled(): boolean {
        return this._value === WorkOrderStatusEnum.CANCELED;
    }

    isFinal(): boolean {
        return this.isCompleted() || this.isCanceled();
    }

    equals(other: WorkOrderStatus): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }

    toJSON(): string {
        return this._value;
    }
}
