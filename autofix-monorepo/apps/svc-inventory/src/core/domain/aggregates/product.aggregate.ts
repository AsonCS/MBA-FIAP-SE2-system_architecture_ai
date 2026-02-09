import { SKU } from '../value-objects/sku.vo';
import { Quantity } from '../value-objects/quantity.vo';
import { Money } from '../value-objects/money.vo';
import { Dimensions } from '../value-objects/dimensions.vo';
import { DomainEvent } from '../events/domain-event.base';
import { LowStockDetected } from '../events/low-stock-detected.event';
import { PriceChanged } from '../events/price-changed.event';
import { StockAdjusted } from '../events/stock-adjusted.event';
import { InsufficientStockError } from '../exceptions/domain.exceptions';

/**
 * Product Aggregate Root
 * Consistency boundary for stock levels and product information
 */
export interface ProductProps {
    id: string;
    sku: SKU;
    name: string;
    description?: string;
    category?: string;
    availableStock: Quantity;
    reservedStock: Quantity;
    minStockLevel: Quantity;
    averageCost: Money;
    sellingPrice: Money;
    dimensions?: Dimensions;
    supplierId?: string;
    version: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Product {
    private readonly props: ProductProps;
    private domainEvents: DomainEvent[] = [];

    private constructor(props: ProductProps) {
        this.props = { ...props };
    }

    static create(
        props: Omit<ProductProps, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
    ): Product {
        const product = new Product({
            ...props,
            id: this.generateId(),
            version: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Check if initial stock is below minimum
        if (props.availableStock.isLessThan(props.minStockLevel)) {
            product.addDomainEvent(
                new LowStockDetected(
                    props.sku.getValue(),
                    props.availableStock.getValue(),
                    props.minStockLevel.getValue(),
                ),
            );
        }

        return product;
    }

    static reconstitute(props: ProductProps): Product {
        return new Product(props);
    }

    private static generateId(): string {
        return `prd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Add stock (e.g., from purchase)
     * Updates available stock and may trigger price changes
     */
    addStock(quantity: Quantity, cost: Money): void {
        const oldPrice = this.props.averageCost;

        // Calculate new average cost using weighted average
        const currentValue = this.props.averageCost.multiply(
            this.props.availableStock.getValue(),
        );
        const addedValue = cost.multiply(quantity.getValue());
        const totalQuantity = this.props.availableStock.add(quantity);

        if (totalQuantity.getValue() > 0) {
            const newAverageCost = currentValue
                .add(addedValue)
                .divide(totalQuantity.getValue());

            this.props.averageCost = newAverageCost;

            // Emit price changed event if cost changed significantly
            if (!oldPrice.equals(newAverageCost)) {
                this.addDomainEvent(
                    new PriceChanged(
                        this.props.sku.getValue(),
                        oldPrice.getAmount(),
                        newAverageCost.getAmount(),
                        newAverageCost.getCurrency(),
                    ),
                );
            }
        }

        this.props.availableStock = this.props.availableStock.add(quantity);
        this.props.updatedAt = new Date();
    }

    /**
     * Reserve stock (e.g., for work order)
     * Moves quantity from available to reserved
     */
    reserve(quantity: Quantity): void {
        if (this.props.availableStock.isLessThan(quantity)) {
            throw new InsufficientStockError(
                this.props.sku.getValue(),
                quantity.getValue(),
                this.props.availableStock.getValue(),
            );
        }

        this.props.availableStock = this.props.availableStock.subtract(quantity);
        this.props.reservedStock = this.props.reservedStock.add(quantity);
        this.props.updatedAt = new Date();

        // Check if stock is now below minimum
        if (this.props.availableStock.isLessThan(this.props.minStockLevel)) {
            this.addDomainEvent(
                new LowStockDetected(
                    this.props.sku.getValue(),
                    this.props.availableStock.getValue(),
                    this.props.minStockLevel.getValue(),
                ),
            );
        }
    }

    /**
     * Confirm consumption (e.g., work order completed)
     * Decrements reserved stock permanently
     */
    confirmConsumption(quantity: Quantity): void {
        if (this.props.reservedStock.isLessThan(quantity)) {
            throw new InsufficientStockError(
                this.props.sku.getValue(),
                quantity.getValue(),
                this.props.reservedStock.getValue(),
            );
        }

        this.props.reservedStock = this.props.reservedStock.subtract(quantity);
        this.props.updatedAt = new Date();
    }

    /**
     * Release reservation (e.g., work order cancelled)
     * Returns reserved quantity back to available
     */
    releaseReservation(quantity: Quantity): void {
        if (this.props.reservedStock.isLessThan(quantity)) {
            throw new InsufficientStockError(
                this.props.sku.getValue(),
                quantity.getValue(),
                this.props.reservedStock.getValue(),
            );
        }

        this.props.reservedStock = this.props.reservedStock.subtract(quantity);
        this.props.availableStock = this.props.availableStock.add(quantity);
        this.props.updatedAt = new Date();
    }

    /**
     * Adjust stock manually (e.g., for inventory corrections)
     */
    adjustStock(newQuantity: Quantity, reason: string, adjustedBy: string): void {
        const oldQuantity = this.props.availableStock;

        this.addDomainEvent(
            new StockAdjusted(
                this.props.sku.getValue(),
                oldQuantity.getValue(),
                newQuantity.getValue(),
                reason,
                adjustedBy,
            ),
        );

        this.props.availableStock = newQuantity;
        this.props.updatedAt = new Date();

        // Check if stock is now below minimum
        if (this.props.availableStock.isLessThan(this.props.minStockLevel)) {
            this.addDomainEvent(
                new LowStockDetected(
                    this.props.sku.getValue(),
                    this.props.availableStock.getValue(),
                    this.props.minStockLevel.getValue(),
                ),
            );
        }
    }

    /**
     * Update selling price
     */
    updateSellingPrice(newPrice: Money): void {
        const oldPrice = this.props.sellingPrice;
        this.props.sellingPrice = newPrice;
        this.props.updatedAt = new Date();

        if (!oldPrice.equals(newPrice)) {
            this.addDomainEvent(
                new PriceChanged(
                    this.props.sku.getValue(),
                    oldPrice.getAmount(),
                    newPrice.getAmount(),
                    newPrice.getCurrency(),
                ),
            );
        }
    }

    /**
     * Get total stock (available + reserved)
     */
    getTotalStock(): Quantity {
        return this.props.availableStock.add(this.props.reservedStock);
    }

    /**
     * Check if stock is below minimum level
     */
    isLowStock(): boolean {
        return this.props.availableStock.isLessThan(this.props.minStockLevel);
    }

    // Getters
    getId(): string {
        return this.props.id;
    }

    getSku(): SKU {
        return this.props.sku;
    }

    getName(): string {
        return this.props.name;
    }

    getDescription(): string | undefined {
        return this.props.description;
    }

    getCategory(): string | undefined {
        return this.props.category;
    }

    getAvailableStock(): Quantity {
        return this.props.availableStock;
    }

    getReservedStock(): Quantity {
        return this.props.reservedStock;
    }

    getMinStockLevel(): Quantity {
        return this.props.minStockLevel;
    }

    getAverageCost(): Money {
        return this.props.averageCost;
    }

    getSellingPrice(): Money {
        return this.props.sellingPrice;
    }

    getDimensions(): Dimensions | undefined {
        return this.props.dimensions;
    }

    getSupplierId(): string | undefined {
        return this.props.supplierId;
    }

    getVersion(): number {
        return this.props.version;
    }

    isActive(): boolean {
        return this.props.active;
    }

    getCreatedAt(): Date {
        return this.props.createdAt;
    }

    getUpdatedAt(): Date {
        return this.props.updatedAt;
    }

    // Domain Events Management
    getDomainEvents(): DomainEvent[] {
        return [...this.domainEvents];
    }

    clearDomainEvents(): void {
        this.domainEvents = [];
    }

    private addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    // Version Management (for Optimistic Locking)
    incrementVersion(): void {
        this.props.version++;
    }

    toJSON(): ProductProps {
        return { ...this.props };
    }
}
