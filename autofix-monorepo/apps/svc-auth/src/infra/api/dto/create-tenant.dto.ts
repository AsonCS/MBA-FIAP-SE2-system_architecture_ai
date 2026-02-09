import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateTenantDto {
    @ApiProperty({ example: 'AutoFix Workshop', description: 'Name of the tenant/company' })
    @IsString()
    @MinLength(3)
    tenantName: string;

    @ApiProperty({ example: '18320743000104', description: 'CNPJ (14 digits)' })
    @IsString()
    @Matches(/^\d{14}$/, { message: 'CNPJ must be 14 digits' })
    cnpj: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the tenant owner' })
    @IsString()
    @MinLength(3)
    ownerName: string;

    @ApiProperty({ example: 'owner@autofix.com', description: 'Email of the tenant owner' })
    @IsEmail()
    ownerEmail: string;

    @ApiProperty({ example: 'password123', description: 'Password for the owner account' })
    @IsString()
    @MinLength(8)
    ownerPassword: string;
}

export class CreateTenantResponseDto {
    @ApiProperty()
    tenantId: string;

    @ApiProperty()
    userId: string;
}
