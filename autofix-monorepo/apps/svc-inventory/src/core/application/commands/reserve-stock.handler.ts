import { IProductRepository } from '../../ports/product.repository.interface';
import { IEventPublisher } from '../../ports/event.interface';
import { ICacheService } from '../../ports/cache.service.interface';
import { ReserveStockCommand } from './reserve-stock.command';
import { SKU } from '../../domain/value-objects/sku.vo';
import { Quantity } from '../../domain/value-objects/quantity.vo';
import { ProductNotFoundError, OptimisticLockError } from '../../domain/exceptions/domain.exceptions';

/**
 * ReserveStockHandler
 * Handles stock reservation with optimistic locking
 */
export class ReserveStockHandler {
    private readonly MAX_RETRIES = 3;

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly cacheService: ICacheService,
    ) { }

    async execute(command: ReserveStockCommand): Promise<void> {
        const sku = SKU.create(command.sku);
        const quantity = Quantity.create(command.quantity);

        let retries = 0;
        let success = false;

        while (retries < this.MAX_RETRIES && !success) {
            try {
                await this.executeWithRetry(sku, quantity, command.workOrderId);
                success = true;
            } catch (error) {
                if (error instanceof OptimisticLockError && retries < this.MAX_RETRIES - 1) {
                    retries++;
                    await this.sleep(Math.pow(2, retries) * 100);
                } else {
                    throw error;
                }
            }
        }
    }

    private async executeWithRetry(
        sku: SKU,
        quantity: Quantity,
        workOrderId: string,
    ): Promise<void> {
        // Load product
        const product = await this.productRepository.findBySku(sku);
        if (!product) {
            throw new ProductNotFoundError(sku.getValue());
        }

        const expectedVersion = product.getVersion();

        // Execute domain logic
        product.reserve(quantity);

        // Persist changes
        await this.productRepository.save(product, expectedVersion);

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
                reservedStock: product.getReservedStock().getValue(),
                sellingPrice: product.getSellingPrice().getAmount(),
                currency: product.getSellingPrice().getCurrency(),
            },
            3600,
        );
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
