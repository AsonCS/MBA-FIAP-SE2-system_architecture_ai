import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiHeader,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { CreateWorkOrder } from '../../core/use-cases/work-order/CreateWorkOrder';
import { ListWorkOrders } from '../../core/use-cases/work-order/ListWorkOrders';
import { UpdateWorkOrderStatus } from '../../core/use-cases/work-order/UpdateWorkOrderStatus';
import { CreateWorkOrderDto, UpdateWorkOrderStatusDto } from './dtos/work-order.dto';
import { WorkOrderStatus } from '../../core/domain/types/work-order.types';

@ApiTags('Work Orders')
@Controller('api/v1/work-orders')
@ApiHeader({
    name: 'x-tenant-id',
    description: 'ID do Tenant (Oficina)',
    required: true,
})
export class WorkOrderController {
    constructor(
        private readonly createWorkOrder: CreateWorkOrder,
        private readonly listWorkOrders: ListWorkOrders,
        private readonly updateWorkOrderStatus: UpdateWorkOrderStatus,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Cria uma nova Ordem de Serviço',
        description: 'Abre uma nova O.S. para um cliente e veículo',
    })
    @ApiResponse({
        status: 201,
        description: 'Ordem de serviço criada com sucesso',
    })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Body() data: CreateWorkOrderDto,
    ) {
        return this.createWorkOrder.execute(tenantId, data);
    }

    @Get()
    @ApiOperation({
        summary: 'Lista Ordens de Serviço',
        description: 'Retorna lista de O.S. com filtros opcionais',
    })
    @ApiQuery({ name: 'status', required: false, enum: WorkOrderStatus })
    @ApiQuery({ name: 'mechanicId', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Lista de ordens de serviço',
    })
    async list(
        @Headers('x-tenant-id') tenantId: string,
        @Query('status') status?: WorkOrderStatus,
        @Query('mechanicId') mechanicId?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.listWorkOrders.execute(tenantId, {
            status,
            mechanicId,
            page,
            limit,
        });
    }

    @Patch(':id/status')
    @ApiOperation({
        summary: 'Atualiza status da O.S.',
        description: 'Atualiza o status de uma ordem de serviço (ex: Aprovar, Finalizar)',
    })
    @ApiParam({ name: 'id', description: 'ID da Ordem de Serviço' })
    @ApiResponse({
        status: 200,
        description: 'Status atualizado com sucesso',
    })
    async updateStatus(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() data: UpdateWorkOrderStatusDto,
    ) {
        return this.updateWorkOrderStatus.execute(tenantId, id, data);
    }
}
