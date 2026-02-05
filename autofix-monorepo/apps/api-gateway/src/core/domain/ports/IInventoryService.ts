import {
    Product,
    ProductFilters,
    CreateMovementDto,
    StockMovement,
} from '../types/inventory.types';

/**
 * Port (Interface) for Inventory Service
 * This defines the contract that any adapter must implement
 */
export abstract class IInventoryService {
    abstract getProducts(
        tenantId: string,
        filters: ProductFilters,
    ): Promise<Product[]>;

    abstract getProductById(tenantId: string, id: string): Promise<Product>;

    abstract registerMovement(
        tenantId: string,
        movement: CreateMovementDto,
    ): Promise<StockMovement>;

    abstract getLowStockProducts(tenantId: string): Promise<Product[]>;

    abstract getProductMovements(
        tenantId: string,
        productId: string,
    ): Promise<StockMovement[]>;
}
