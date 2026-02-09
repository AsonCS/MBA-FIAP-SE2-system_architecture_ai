/**
 * Base Domain Exception
 */
export abstract class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * InvalidStatusTransitionException
 * Thrown when attempting an invalid status transition
 */
export class InvalidStatusTransitionException extends DomainException {
    constructor(currentStatus: string, attemptedStatus: string) {
        super(
            `Cannot transition from ${currentStatus} to ${attemptedStatus}`,
        );
    }
}

/**
 * WorkOrderNotFoundException
 * Thrown when a work order is not found
 */
export class WorkOrderNotFoundException extends DomainException {
    constructor(workOrderId: string) {
        super(`Work order with ID ${workOrderId} not found`);
    }
}

/**
 * ItemNotFoundException
 * Thrown when an item is not found in a work order
 */
export class ItemNotFoundException extends DomainException {
    constructor(itemId: string) {
        super(`Item with ID ${itemId} not found in work order`);
    }
}

/**
 * InsufficientStockException
 * Thrown when there's not enough stock for a part
 */
export class InsufficientStockException extends DomainException {
    constructor(sku: string, requested: number, available: number) {
        super(
            `Insufficient stock for SKU ${sku}. Requested: ${requested}, Available: ${available}`,
        );
    }
}

/**
 * WorkOrderAlreadyFinalizedException
 * Thrown when attempting to modify a finalized work order
 */
export class WorkOrderAlreadyFinalizedException extends DomainException {
    constructor(workOrderId: string) {
        super(`Work order ${workOrderId} is already finalized and cannot be modified`);
    }
}

/**
 * InvalidOperationException
 * Thrown when an operation is not allowed in the current state
 */
export class InvalidOperationException extends DomainException {
    constructor(operation: string, reason: string) {
        super(`Operation '${operation}' is not allowed: ${reason}`);
    }
}
