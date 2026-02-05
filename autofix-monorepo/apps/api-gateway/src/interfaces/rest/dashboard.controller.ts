import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { GetDashboardOverview } from '../../core/use-cases/dashboard/GetDashboardOverview';

@ApiTags('Dashboard')
@Controller('api/v1/dashboard')
export class DashboardController {
    constructor(private readonly getDashboardOverview: GetDashboardOverview) { }

    @Get()
    @ApiOperation({
        summary: 'Obtém visão geral do dashboard',
        description:
            'Retorna dados agregados incluindo ordens de serviço recentes, total de clientes e alertas de estoque baixo',
    })
    @ApiHeader({
        name: 'x-tenant-id',
        description: 'ID do Tenant (Oficina)',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Dados do dashboard retornados com sucesso',
    })
    @ApiResponse({
        status: 400,
        description: 'Tenant ID não fornecido',
    })
    async getDashboard(@Headers('x-tenant-id') tenantId: string) {
        if (!tenantId) {
            throw new Error('Tenant ID is required');
        }
        return this.getDashboardOverview.execute(tenantId);
    }
}
