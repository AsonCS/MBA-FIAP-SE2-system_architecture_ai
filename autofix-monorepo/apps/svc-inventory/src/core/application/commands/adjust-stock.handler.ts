import { IProductRepository } from '../../ports/product.repository.interface';
import { IMovementRepository } from '../../ports/movement.repository.interface';
import { IEventPublisher } from '../../ports/event.interface';
import { ICacheService } from '../../ports/cache.service.interface';
import { AdjustStockCommand } from './adjust-stock.command';
import { SKU } from '../../domain/value-objects/sku.vo';
import { Quantity } from '../../domain/value-objects/quantity.vo';
import { ProductNotFoundError, OptimisticLockError } from '../../domain/exceptions/domain.exceptions';
import { StockMovement, MovementType, MovementReason } from '../../domain/entities/stock-movement.entity';

/**
 * AdjustStockHandler
 * Handles manual stock adjustment with retry logic for optimistic locking
 */
export class AdjustStockHandler {
    private readonly MAX_RETRIES = 3;

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly movementRepository: IMovementRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly cacheService: ICacheService,
    ) { }

    async execute(command: AdjustStockCommand): Promise<void> {
        const sku = SKU.create(command.sku);
        const newQuantity = Quantity.create(command.newQuantity);

        let retries = 0;
        let success = false;

        while (retries < this.MAX_RETRIES && !success) {
            try {
                await this.executeWithRetry(sku, newQuantity, command);
                success = true;
            } catch (error) {
                if (error instanceof OptimisticLockError && retries < this.MAX_RETRIES - 1) {
                    retries++;
                    // Exponential backoff
                    await this.sleep(Math.pow(2, retries) * 100);
                } else {
                    throw error;
                }
            }
        }
    }

    private async executeWithRetry(
        sku: SKU,
        newQuantity: Quantity,
        command: AdjustStockCommand,
    ): Promise<void> {
        // Load product
        const product = await this.productRepository.findBySku(sku);
        if (!product) {
            throw new ProductNotFoundError(sku.getValue());
        }

        const expectedVersion = product.getVersion();
        const oldQuantity = product.getAvailableStock();

        // Execute domain logic
        product.adjustStock(newQuantity, command.reason, command.adjustedBy);

        // Create stock movement record
        const movement = StockMovement.create({
            sku: sku.getValue(),
            type: MovementType.ADJUSTMENT,
            reason: MovementReason.ADJUSTMENT,
            quantity: Math.abs(newQuantity.getValue() - oldQuantity.getValue()),
            balanceAfter: newQuantity.getValue(),
            notes: command.reason,
            createdBy: command.adjustedBy,
        });

        // Persist changes (atomic transaction should be handled by repository)
        await this.productRepository.save(product, expectedVersion);
        await this.movementRepository.log(movement);

        // Publish domain events
        const events = product.getDomainEvents();
        if (events.length > 0) {
            await this.eventPublisher.publishAll(events);
            product.clearDomainEvents();
        }

        // Update cache
        await this.updateCache(sku.getValue(), product);
    }

    private async updateCache(sku: string, product: any): Promise<void> {
        const cacheKey = `product:${sku}`;
        await this.cacheService.set(
            cacheKey,
            {
                sku: sku,
                name: product.getName(),
                availableStock: product.getAvailableStock().getValue(),
                sellingPrice: product.getSellingPrice().getAmount(),
                currency: product.getSellingPrice().getCurrency(),
            },
            3600, // 1 hour TTL
        );
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
