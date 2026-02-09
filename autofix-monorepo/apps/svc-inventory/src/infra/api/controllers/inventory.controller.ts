import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    HttpException,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AdjustStockDto, ReserveStockDto, ConsumeStockDto, CreateProductDto } from '../dtos/inventory.dto';
import { AdjustStockHandler } from '../../../core/application/commands/adjust-stock.handler';
import { AdjustStockCommand } from '../../../core/application/commands/adjust-stock.command';
import { ReserveStockHandler } from '../../../core/application/commands/reserve-stock.handler';
import { ReserveStockCommand } from '../../../core/application/commands/reserve-stock.command';
import { ConsumeStockHandler } from '../../../core/application/commands/consume-stock.handler';
import { ConsumeStockCommand } from '../../../core/application/commands/consume-stock.command';
import { GetProductAvailabilityHandler } from '../../../core/application/queries/get-product-availability.handler';
import { GetProductAvailabilityQuery } from '../../../core/application/queries/get-product-availability.query';
import { GetStockLedgerHandler } from '../../../core/application/queries/get-stock-ledger.handler';
import { GetStockLedgerQuery } from '../../../core/application/queries/get-stock-ledger.query';
import {
    InsufficientStockError,
    ProductNotFoundError,
    OptimisticLockError,
} from '../../../core/domain/exceptions/domain.exceptions';
import { IProductRepository } from '../../../core/ports/product.repository.interface';
import { Product } from '../../../core/domain/aggregates/product.aggregate';
import { SKU } from '../../../core/domain/value-objects/sku.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import { Money } from '../../../core/domain/value-objects/money.vo';

/**
 * InventoryController
 * REST API for inventory management
 */
@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
    private readonly logger = new Logger(InventoryController.name);

    constructor(
        private readonly adjustStockHandler: AdjustStockHandler,
        private readonly reserveStockHandler: ReserveStockHandler,
        private readonly consumeStockHandler: ConsumeStockHandler,
        private readonly getProductAvailabilityHandler: GetProductAvailabilityHandler,
        private readonly getStockLedgerHandler: GetStockLedgerHandler,
        private readonly productRepository: IProductRepository,
    ) { }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 409, description: 'Product already exists' })
    async createProduct(@Body() dto: CreateProductDto) {
        try {
            const sku = SKU.create(dto.sku);

            // Check if product already exists
            const exists = await this.productRepository.existsBySku(sku);
            if (exists) {
                throw new HttpException(
                    `Product with SKU ${dto.sku} already exists`,
                    HttpStatus.CONFLICT,
                );
            }

            const product = Product.create({
                sku,
                name: dto.name,
                description: dto.description,
                category: dto.category,
                availableStock: Quantity.create(dto.initialStock),
                reservedStock: Quantity.zero(),
                minStockLevel: Quantity.create(dto.minStockLevel),
                averageCost: Money.create(dto.cost, dto.currency),
                sellingPrice: Money.create(dto.sellingPrice, dto.currency),
                active: true,
            });

            await this.productRepository.create(product);

            return {
                message: 'Product created successfully',
                productId: product.getId(),
                sku: product.getSku().getValue(),
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get('products/:sku/availability')
    @ApiOperation({ summary: 'Get product availability' })
    @ApiParam({ name: 'sku', example: 'OIL-FIL-001' })
    @ApiResponse({ status: 200, description: 'Product availability retrieved' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getProductAvailability(@Param('sku') sku: string) {
        try {
            const query = new GetProductAvailabilityQuery(sku);
            return await this.getProductAvailabilityHandler.execute(query);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get('products/:sku/ledger')
    @ApiOperation({ summary: 'Get stock movement history (Kardex)' })
    @ApiParam({ name: 'sku', example: 'OIL-FIL-001' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    @ApiResponse({ status: 200, description: 'Stock ledger retrieved' })
    async getStockLedger(
        @Param('sku') sku: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50,
    ) {
        try {
            const query = new GetStockLedgerQuery(sku, page, limit);
            return await this.getStockLedgerHandler.execute(query);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('adjust')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Manually adjust stock levels' })
    @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ApiResponse({ status: 409, description: 'Concurrent update conflict' })
    async adjustStock(@Body() dto: AdjustStockDto) {
        try {
            const command = new AdjustStockCommand(
                dto.sku,
                dto.newQuantity,
                dto.reason,
                dto.adjustedBy,
            );

            await this.adjustStockHandler.execute(command);

            return {
                message: 'Stock adjusted successfully',
                sku: dto.sku,
                newQuantity: dto.newQuantity,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('reserve')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reserve stock for work order' })
    @ApiResponse({ status: 200, description: 'Stock reserved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ApiResponse({ status: 422, description: 'Insufficient stock' })
    async reserveStock(@Body() dto: ReserveStockDto) {
        try {
            const command = new ReserveStockCommand(
                dto.sku,
                dto.quantity,
                dto.workOrderId,
            );

            await this.reserveStockHandler.execute(command);

            return {
                message: 'Stock reserved successfully',
                sku: dto.sku,
                quantity: dto.quantity,
                workOrderId: dto.workOrderId,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('consume')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirm stock consumption' })
    @ApiResponse({ status: 200, description: 'Stock consumed successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ApiResponse({ status: 422, description: 'Insufficient reserved stock' })
    async consumeStock(@Body() dto: ConsumeStockDto) {
        try {
            const command = new ConsumeStockCommand(
                dto.sku,
                dto.quantity,
                dto.workOrderId,
                dto.consumedBy,
            );

            await this.consumeStockHandler.execute(command);

            return {
                message: 'Stock consumed successfully',
                sku: dto.sku,
                quantity: dto.quantity,
                workOrderId: dto.workOrderId,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
        this.logger.error('Error in InventoryController:', error);

        if (error instanceof ProductNotFoundError) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }

        if (error instanceof InsufficientStockError) {
            throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (error instanceof OptimisticLockError) {
            throw new HttpException(
                'Concurrent update conflict. Please retry.',
                HttpStatus.CONFLICT,
            );
        }

        if (error instanceof HttpException) {
            throw error;
        }

        throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
