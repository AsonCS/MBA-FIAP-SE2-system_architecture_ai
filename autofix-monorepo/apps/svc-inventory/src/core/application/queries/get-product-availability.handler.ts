import { IProductRepository } from '../../ports/product.repository.interface';
import { ICacheService } from '../../ports/cache.service.interface';
import { GetProductAvailabilityQuery } from './get-product-availability.query';
import { SKU } from '../../domain/value-objects/sku.vo';
import { ProductNotFoundError } from '../../domain/exceptions/domain.exceptions';

/**
 * ProductAvailabilityDTO
 * Data transfer object for product availability
 */
export interface ProductAvailabilityDTO {
    sku: string;
    name: string;
    availableStock: number;
    reservedStock: number;
    totalStock: number;
    minStockLevel: number;
    isLowStock: boolean;
    sellingPrice: number;
    currency: string;
}

/**
 * GetProductAvailabilityHandler
 * Handles product availability queries with cache-aside pattern
 */
export class GetProductAvailabilityHandler {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly cacheService: ICacheService,
    ) { }

    async execute(
        query: GetProductAvailabilityQuery,
    ): Promise<ProductAvailabilityDTO> {
        const sku = SKU.create(query.sku);
        const cacheKey = `product:${sku.getValue()}`;

        // Try cache first
        const cached = await this.cacheService.get<ProductAvailabilityDTO>(cacheKey);
        if (cached) {
            return cached;
        }

        // Cache miss - load from database
        const product = await this.productRepository.findBySku(sku);
        if (!product) {
            throw new ProductNotFoundError(sku.getValue());
        }

        const dto: ProductAvailabilityDTO = {
            sku: product.getSku().getValue(),
            name: product.getName(),
            availableStock: product.getAvailableStock().getValue(),
            reservedStock: product.getReservedStock().getValue(),
            totalStock: product.getTotalStock().getValue(),
            minStockLevel: product.getMinStockLevel().getValue(),
            isLowStock: product.isLowStock(),
            sellingPrice: product.getSellingPrice().getAmount(),
            currency: product.getSellingPrice().getCurrency(),
        };

        // Update cache
        await this.cacheService.set(cacheKey, dto, 3600);

        return dto;
    }
}
