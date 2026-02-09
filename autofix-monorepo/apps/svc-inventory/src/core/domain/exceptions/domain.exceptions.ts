/**
 * InsufficientStockError
 * Thrown when attempting to reserve or consume more stock than available
 */
export class InsufficientStockError extends Error {
    constructor(
        public readonly sku: string,
        public readonly requested: number,
        public readonly available: number,
    ) {
        super(
            `Insufficient stock for SKU ${sku}. Requested: ${requested}, Available: ${available}`,
        );
        this.name = 'InsufficientStockError';
    }
}

/**
 * InvalidQuantityError
 * Thrown when quantity validation fails
 */
export class InvalidQuantityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidQuantityError';
    }
}

/**
 * ProductNotFoundError
 * Thrown when a product cannot be found
 */
export class ProductNotFoundError extends Error {
    constructor(public readonly sku: string) {
        super(`Product with SKU ${sku} not found`);
        this.name = 'ProductNotFoundError';
    }
}

/**
 * OptimisticLockError
 * Thrown when version mismatch occurs during concurrent updates
 */
export class OptimisticLockError extends Error {
    constructor(
        public readonly sku: string,
        public readonly expectedVersion: number,
        public readonly actualVersion: number,
    ) {
        super(
            `Optimistic lock failed for SKU ${sku}. Expected version: ${expectedVersion}, Actual version: ${actualVersion}`,
        );
        this.name = 'OptimisticLockError';
    }
}
