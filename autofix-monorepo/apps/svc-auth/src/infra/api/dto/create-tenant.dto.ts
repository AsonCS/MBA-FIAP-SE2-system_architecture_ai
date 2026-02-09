import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @MinLength(3)
    tenantName: string;

    @IsString()
    @Matches(/^\d{14}$/, { message: 'CNPJ must be 14 digits' })
    cnpj: string;

    @IsString()
    @MinLength(3)
    ownerName: string;

    @IsEmail()
    ownerEmail: string;

    @IsString()
    @MinLength(8)
    ownerPassword: string;
}

export class CreateTenantResponseDto {
    tenantId: string;
    userId: string;
}
