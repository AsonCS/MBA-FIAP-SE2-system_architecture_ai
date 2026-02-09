import { StockMovement } from '../domain/entities/stock-movement.entity';

/**
 * IMovementRepository Port
 * Interface for immutable stock movement persistence (Kardex)
 */
export interface IMovementRepository {
    /**
     * Log a stock movement (immutable)
     */
    log(movement: StockMovement): Promise<void>;

    /**
     * Get movement history for a product
     */
    findBySku(sku: string, page: number, limit: number): Promise<StockMovement[]>;

    /**
     * Get movements by reference (e.g., WorkOrder ID)
     */
    findByReference(reference: string): Promise<StockMovement[]>;

    /**
     * Get movements within date range
     */
    findByDateRange(
        sku: string,
        startDate: Date,
        endDate: Date,
    ): Promise<StockMovement[]>;

    /**
     * Get all movements with pagination
     */
    findAll(page: number, limit: number): Promise<StockMovement[]>;
}
