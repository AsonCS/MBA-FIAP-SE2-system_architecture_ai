import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * AdjustStockDto
 * DTO for stock adjustment requests
 */
export class AdjustStockDto {
    @ApiProperty({ example: 'OIL-FIL-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    newQuantity: number;

    @ApiProperty({ example: 'Physical inventory count' })
    @IsString()
    reason: string;

    @ApiProperty({ example: 'admin@autofix.com' })
    @IsString()
    adjustedBy: string;
}

/**
 * ReserveStockDto
 * DTO for stock reservation requests
 */
export class ReserveStockDto {
    @ApiProperty({ example: 'OIL-FIL-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 'WO-2024-001' })
    @IsString()
    workOrderId: string;
}

/**
 * ConsumeStockDto
 * DTO for stock consumption requests
 */
export class ConsumeStockDto {
    @ApiProperty({ example: 'OIL-FIL-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 'WO-2024-001' })
    @IsString()
    workOrderId: string;

    @ApiProperty({ example: 'mechanic@autofix.com' })
    @IsString()
    consumedBy: string;
}

/**
 * CreateProductDto
 * DTO for creating new products
 */
export class CreateProductDto {
    @ApiProperty({ example: 'OIL-FIL-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 'Oil Filter Premium' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'High-quality oil filter for automotive use', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'Filters', required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    initialStock: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    minStockLevel: number;

    @ApiProperty({ example: 25.50 })
    @IsNumber()
    @Min(0)
    cost: number;

    @ApiProperty({ example: 45.00 })
    @IsNumber()
    @Min(0)
    sellingPrice: number;

    @ApiProperty({ example: 'BRL', required: false })
    @IsOptional()
    @IsString()
    currency?: string;
}
