import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 8 chars)' })
    @IsString()
    @MinLength(8)
    password: string;
}

export class LoginResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty({
        example: {
            id: 'uuid',
            email: 'user@example.com',
            name: 'John Doe',
            role: 'owner',
            tenantId: 'uuid',
        },
    })
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        tenantId: string;
    };
}
