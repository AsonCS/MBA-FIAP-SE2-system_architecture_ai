import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus } from '../../../core/domain/types/work-order.types';

export class CreateWorkOrderDto {
    @ApiProperty({ description: 'ID do cliente' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ description: 'ID do veículo' })
    @IsString()
    @IsNotEmpty()
    vehicleId: string;

    @ApiProperty({ description: 'Descrição do serviço' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Itens da ordem de serviço', required: false })
    @IsArray()
    @IsOptional()
    items?: any[];
}

export class UpdateWorkOrderStatusDto {
    @ApiProperty({ description: 'Novo status da ordem de serviço', enum: WorkOrderStatus })
    @IsEnum(WorkOrderStatus)
    @IsNotEmpty()
    status: WorkOrderStatus;

    @ApiProperty({ description: 'Observações', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
