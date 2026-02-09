import { IUserRepository } from '../ports/user-repository.port';
import { IHasher } from '../ports/hasher.port';
import { ITokenService, TokenPayload } from '../ports/token-service.port';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository.port';
import { InvalidCredentialsError, InactiveUserError, SuspendedTenantError } from '../domain/exceptions/domain-exceptions';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        tenantId: string;
    };
}

export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hasher: IHasher,
        private readonly tokenService: ITokenService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) { }

    async execute(request: LoginRequest): Promise<LoginResponse> {
        // 1. Find user by email
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        // 2. Check if user is active
        if (!user.isActive) {
            throw new InactiveUserError(user.id);
        }

        // 3. Validate password
        const isPasswordValid = await user.validatePassword(request.password, this.hasher);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        // 4. Generate tokens
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email.getValue(),
            role: user.role,
            tenantId: user.tenantId,
        };

        const accessToken = this.tokenService.sign(payload, '15m');
        const refreshToken = this.tokenService.sign(payload, '7d');

        // 5. Store refresh token in Redis (7 days TTL)
        await this.refreshTokenRepository.save(user.id, refreshToken, 7 * 24 * 60 * 60);

        // 6. Return response
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email.getValue(),
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
            },
        };
    }
}
