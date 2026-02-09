import { ITokenService } from '../ports/token-service.port';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository.port';
import { UnauthorizedError } from '../domain/exceptions/domain-exceptions';

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class RefreshTokenUseCase {
    constructor(
        private readonly tokenService: ITokenService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) { }

    async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        // 1. Verify token
        let payload;
        try {
            payload = this.tokenService.verify(request.refreshToken);
        } catch (error) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        // 2. Check if token is revoked
        const isRevoked = await this.refreshTokenRepository.isRevoked(request.refreshToken);
        if (isRevoked) {
            throw new UnauthorizedError('Token has been revoked');
        }

        // 3. Check if token exists in Redis
        const storedToken = await this.refreshTokenRepository.find(payload.userId);
        if (!storedToken || storedToken !== request.refreshToken) {
            throw new UnauthorizedError('Token not found or mismatch');
        }

        // 4. Generate new tokens
        const newAccessToken = this.tokenService.sign(payload, '15m');
        const newRefreshToken = this.tokenService.sign(payload, '7d');

        // 5. Update refresh token in Redis
        await this.refreshTokenRepository.save(payload.userId, newRefreshToken, 7 * 24 * 60 * 60);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}
