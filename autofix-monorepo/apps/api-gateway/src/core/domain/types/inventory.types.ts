// Domain types for Inventory
export interface Product {
    id: string;
    tenantId: string;
    code: string;
    name: string;
    description?: string;
    category: string;
    unitPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFilters {
    category?: string;
    search?: string;
    lowStock?: boolean;
    page?: number;
    limit?: number;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: MovementType;
    quantity: number;
    reason: string;
    userId: string;
    createdAt: Date;
}

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
}

export interface CreateMovementDto {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: string;
}
