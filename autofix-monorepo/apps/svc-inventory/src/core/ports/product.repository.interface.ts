import { Product } from '../domain/aggregates/product.aggregate';
import { SKU } from '../domain/value-objects/sku.vo';

/**
 * IProductRepository Port
 * Interface for product persistence with optimistic locking support
 */
export interface IProductRepository {
    /**
     * Find product by SKU
     */
    findBySku(sku: SKU): Promise<Product | null>;

    /**
     * Find product by ID
     */
    findById(id: string): Promise<Product | null>;

    /**
     * Find all products with pagination
     */
    findAll(page: number, limit: number): Promise<Product[]>;

    /**
     * Find products by category
     */
    findByCategory(category: string): Promise<Product[]>;

    /**
     * Find products with low stock
     */
    findLowStock(): Promise<Product[]>;

    /**
     * Save product with optimistic locking
     * @param product - Product to save
     * @param expectedVersion - Expected version for optimistic lock check
     * @throws OptimisticLockError if version mismatch
     */
    save(product: Product, expectedVersion: number): Promise<void>;

    /**
     * Create new product
     */
    create(product: Product): Promise<void>;

    /**
     * Delete product (soft delete)
     */
    delete(id: string): Promise<void>;

    /**
     * Check if SKU exists
     */
    existsBySku(sku: SKU): Promise<boolean>;
}
