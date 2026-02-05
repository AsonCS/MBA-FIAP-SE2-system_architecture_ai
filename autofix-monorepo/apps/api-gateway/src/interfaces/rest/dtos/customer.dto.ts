import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ description: 'Nome do cliente' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Email do cliente' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Telefone do cliente' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ description: 'Documento (CPF/CNPJ)' })
    @IsString()
    @IsNotEmpty()
    document: string;
}

export class CreateVehicleDto {
    @ApiProperty({ description: 'Placa do veículo' })
    @IsString()
    @IsNotEmpty()
    plate: string;

    @ApiProperty({ description: 'Modelo do veículo' })
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiProperty({ description: 'Marca do veículo' })
    @IsString()
    @IsNotEmpty()
    brand: string;

    @ApiProperty({ description: 'Ano do veículo' })
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @ApiProperty({ description: 'Chassi do veículo', required: false })
    @IsString()
    @IsOptional()
    chassis?: string;

    @ApiProperty({ description: 'Cor do veículo', required: false })
    @IsString()
    @IsOptional()
    color?: string;
}
