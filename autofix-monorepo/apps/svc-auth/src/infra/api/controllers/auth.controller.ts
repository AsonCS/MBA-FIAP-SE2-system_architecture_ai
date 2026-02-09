import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { LoginUseCase } from '@core/application/login.usecase';
import { CreateTenantUseCase } from '@core/application/create-tenant.usecase';
import { RefreshTokenUseCase } from '@core/application/refresh-token.usecase';
import { LogoutUseCase } from '@core/application/logout.usecase';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { CreateTenantDto, CreateTenantResponseDto } from '../dto/create-tenant.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly createTenantUseCase: CreateTenantUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly logoutUseCase: LogoutUseCase,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        return this.loginUseCase.execute(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: CreateTenantDto): Promise<CreateTenantResponseDto> {
        return this.createTenantUseCase.execute(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUseCase.execute(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Request() req: any): Promise<void> {
        const userId = req.user.userId;
        const token = req.headers.authorization?.replace('Bearer ', '');
        await this.logoutUseCase.execute({ userId, accessToken: token });
    }
}
