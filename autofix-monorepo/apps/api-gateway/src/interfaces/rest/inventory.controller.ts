import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiHeader,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { GetProducts } from '../../core/use-cases/inventory/GetProducts';
import { CreateMovementDto } from './dtos/inventory.dto';
import { IInventoryService } from '../../core/domain/ports/IInventoryService';

@ApiTags('Inventory')
@Controller('api/v1/products')
@ApiHeader({
    name: 'x-tenant-id',
    description: 'ID do Tenant (Oficina)',
    required: true,
})
export class InventoryController {
    constructor(
        private readonly getProducts: GetProducts,
        private readonly inventoryService: IInventoryService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Consulta catálogo de peças',
        description: 'Retorna lista de produtos/peças com filtros opcionais',
    })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'lowStock', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Lista de produtos',
    })
    async list(
        @Headers('x-tenant-id') tenantId: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('lowStock') lowStock?: boolean,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.getProducts.execute(tenantId, {
            category,
            search,
            lowStock,
            page,
            limit,
        });
    }

    @Post('movement')
    @ApiOperation({
        summary: 'Registra movimentação de estoque',
        description: 'Registra entrada, saída ou ajuste manual de estoque',
    })
    @ApiResponse({
        status: 201,
        description: 'Movimentação registrada com sucesso',
    })
    async registerMovement(
        @Headers('x-tenant-id') tenantId: string,
        @Body() movement: CreateMovementDto,
    ) {
        return this.inventoryService.registerMovement(tenantId, movement);
    }
}
