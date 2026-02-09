import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUseCase } from '@core/application/login.usecase';
import { CreateTenantUseCase } from '@core/application/create-tenant.usecase';
import { RefreshTokenUseCase } from '@core/application/refresh-token.usecase';
import { LogoutUseCase } from '@core/application/logout.usecase';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { CreateTenantDto, CreateTenantResponseDto } from '../dto/create-tenant.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('auth')
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
    @ApiOperation({ summary: 'User login', description: 'Authenticate user and return access/refresh tokens' })
    @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        return this.loginUseCase.execute(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register tenant', description: 'Create a new tenant and an owner user' })
    @ApiResponse({ status: HttpStatus.CREATED, type: CreateTenantResponseDto })
    async register(@Body() dto: CreateTenantDto): Promise<CreateTenantResponseDto> {
        return this.createTenantUseCase.execute(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh token', description: 'Get a new access token using a refresh token' })
    @ApiResponse({ status: HttpStatus.OK, type: RefreshTokenResponseDto })
    async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUseCase.execute(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'User logout', description: 'Invalidate current session' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Logout successful' })
    async logout(@Request() req: any): Promise<void> {
        const userId = req.user.userId;
        const token = req.headers.authorization?.replace('Bearer ', '');
        await this.logoutUseCase.execute({ userId, accessToken: token });
    }
}
