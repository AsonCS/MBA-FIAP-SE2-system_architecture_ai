/**
 * IInventoryGateway Port
 * Anti-Corruption Layer for svc-inventory integration
 */
export interface IInventoryGateway {
    /**
     * Checks if a part is available in the specified quantity
     */
    checkAvailability(sku: string, quantity: number, tenantId: string): Promise<boolean>;

    /**
     * Gets current stock level for a part
     */
    getStockLevel(sku: string, tenantId: string): Promise<number>;

    /**
     * Reserves stock for a work order (soft reservation)
     */
    reserveStock(sku: string, quantity: number, workOrderId: string, tenantId: string): Promise<void>;

    /**
     * Releases reserved stock (e.g., when work order is canceled)
     */
    releaseReservation(workOrderId: string, tenantId: string): Promise<void>;

    /**
     * Gets part information
     */
    getPartInfo(sku: string, tenantId: string): Promise<PartInfo | null>;

    /**
     * Checks availability for multiple parts at once
     */
    checkMultipleAvailability(
        items: Array<{ sku: string; quantity: number }>,
        tenantId: string,
    ): Promise<AvailabilityCheckResult[]>;
}

export interface PartInfo {
    sku: string;
    name: string;
    description?: string;
    unitPrice: number; // in cents
    manufacturer?: string;
    stockLevel: number;
}

export interface AvailabilityCheckResult {
    sku: string;
    requested: number;
    available: number;
    isAvailable: boolean;
}
