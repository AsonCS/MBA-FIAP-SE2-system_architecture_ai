import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
    CreateWorkOrderCommand,
    AddPartItemCommand,
    AddServiceItemCommand,
    CompleteWorkOrderCommand,
} from '../../../core/application/commands';
import {
    GetWorkOrderQuery,
    ListWorkOrdersQuery,
} from '../../../core/application/queries';
import {
    CreateWorkOrderDto,
    AddPartItemDto,
    AddServiceItemDto,
    UpdateWorkOrderStatusDto,
    GetWorkOrderDto,
    ListWorkOrdersDto,
    WorkOrderResponseDto,
} from '../../../core/application/dtos';

/**
 * WorkOrderController
 * REST API endpoints for work order management
 */
@ApiTags('Work Orders')
@Controller('api/work-orders')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, TenantGuard) // Uncomment when auth is implemented
export class WorkOrderController {
    constructor(
        private readonly createWorkOrderCommand: CreateWorkOrderCommand,
        private readonly addPartItemCommand: AddPartItemCommand,
        private readonly addServiceItemCommand: AddServiceItemCommand,
        private readonly completeWorkOrderCommand: CompleteWorkOrderCommand,
        private readonly getWorkOrderQuery: GetWorkOrderQuery,
        private readonly listWorkOrdersQuery: ListWorkOrdersQuery,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new work order' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Work order created successfully',
    })
    async createWorkOrder(
        @Body() dto: CreateWorkOrderDto,
    ): Promise<WorkOrderResponseDto> {
        return await this.createWorkOrderCommand.execute(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List work orders' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of work orders',
    })
    async listWorkOrders(
        @Query() dto: ListWorkOrdersDto,
    ): Promise<WorkOrderResponseDto[]> {
        return await this.listWorkOrdersQuery.execute(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a work order by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Work order details',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Work order not found',
    })
    async getWorkOrder(
        @Param('id') id: string,
        @Query('tenantId') tenantId: string,
    ): Promise<WorkOrderResponseDto> {
        const dto: GetWorkOrderDto = { workOrderId: id, tenantId };
        return await this.getWorkOrderQuery.execute(dto);
    }

    @Post(':id/items/parts')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add a part item to work order' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Part item added successfully',
    })
    async addPartItem(
        @Param('id') workOrderId: string,
        @Body() dto: Omit<AddPartItemDto, 'workOrderId'>,
    ): Promise<WorkOrderResponseDto> {
        return await this.addPartItemCommand.execute({
            ...dto,
            workOrderId,
        });
    }

    @Post(':id/items/services')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add a service item to work order' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Service item added successfully',
    })
    async addServiceItem(
        @Param('id') workOrderId: string,
        @Body() dto: Omit<AddServiceItemDto, 'workOrderId'>,
    ): Promise<WorkOrderResponseDto> {
        return await this.addServiceItemCommand.execute({
            ...dto,
            workOrderId,
        });
    }

    @Patch(':id/complete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Complete a work order' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Work order completed successfully',
    })
    async completeWorkOrder(
        @Param('id') workOrderId: string,
        @Body('tenantId') tenantId: string,
    ): Promise<WorkOrderResponseDto> {
        const dto: UpdateWorkOrderStatusDto = {
            workOrderId,
            tenantId,
            newStatus: 'COMPLETED',
        };
        return await this.completeWorkOrderCommand.execute(dto);
    }
}
