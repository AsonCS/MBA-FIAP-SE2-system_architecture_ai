import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '../../../core/domain/types/inventory.types';

export class CreateMovementDto {
    @ApiProperty({ description: 'ID do produto' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Tipo de movimentação', enum: MovementType })
    @IsEnum(MovementType)
    @IsNotEmpty()
    type: MovementType;

    @ApiProperty({ description: 'Quantidade' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Motivo da movimentação' })
    @IsString()
    @IsNotEmpty()
    reason: string;
}
