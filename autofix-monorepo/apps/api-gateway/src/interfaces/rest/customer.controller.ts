import {
    Controller,
    Get,
    Post,
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
import { CreateCustomer } from '../../core/use-cases/customer/CreateCustomer';
import { AddVehicleToCustomer } from '../../core/use-cases/customer/AddVehicleToCustomer';
import { CreateCustomerDto, CreateVehicleDto } from './dtos/customer.dto';
import { ICustomerService } from '../../core/domain/ports/ICustomerService';

@ApiTags('Customers & Vehicles')
@Controller('api/v1')
@ApiHeader({
    name: 'x-tenant-id',
    description: 'ID do Tenant (Oficina)',
    required: true,
})
export class CustomerController {
    constructor(
        private readonly createCustomer: CreateCustomer,
        private readonly addVehicleToCustomer: AddVehicleToCustomer,
        private readonly customerService: ICustomerService,
    ) { }

    @Get('customers')
    @ApiOperation({
        summary: 'Lista clientes',
        description: 'Retorna lista de clientes com paginação e filtros',
    })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Lista de clientes',
    })
    async listCustomers(
        @Headers('x-tenant-id') tenantId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        return this.customerService.listCustomers(tenantId, {
            page,
            limit,
            search,
        });
    }

    @Post('customers')
    @ApiOperation({
        summary: 'Cria novo cliente',
        description: 'Cadastra um novo cliente no sistema',
    })
    @ApiResponse({
        status: 201,
        description: 'Cliente criado com sucesso',
    })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Body() data: CreateCustomerDto,
    ) {
        return this.createCustomer.execute(tenantId, data);
    }

    @Post('customers/:id/vehicles')
    @ApiOperation({
        summary: 'Adiciona veículo ao cliente',
        description: 'Cadastra um novo veículo para um cliente existente',
    })
    @ApiParam({ name: 'id', description: 'ID do Cliente' })
    @ApiResponse({
        status: 201,
        description: 'Veículo adicionado com sucesso',
    })
    async addVehicle(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') customerId: string,
        @Body() vehicle: CreateVehicleDto,
    ) {
        return this.addVehicleToCustomer.execute(tenantId, customerId, vehicle);
    }

    @Get('vehicles/:placa')
    @ApiOperation({
        summary: 'Busca veículo pela placa',
        description: 'Retorna dados do veículo consultando pela placa',
    })
    @ApiParam({ name: 'placa', description: 'Placa do veículo' })
    @ApiResponse({
        status: 200,
        description: 'Dados do veículo',
    })
    async getVehicleByPlate(
        @Headers('x-tenant-id') tenantId: string,
        @Param('placa') placa: string,
    ) {
        return this.customerService.getVehicleByPlate(tenantId, placa);
    }
}
