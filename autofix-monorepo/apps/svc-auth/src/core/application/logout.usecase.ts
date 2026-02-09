import { IRefreshTokenRepository } from '../ports/refresh-token-repository.port';
import { ITokenService } from '../ports/token-service.port';

export interface LogoutRequest {
    userId: string;
    accessToken: string;
}

export class LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly tokenService: ITokenService,
    ) { }

    async execute(request: LogoutRequest): Promise<void> {
        // 1. Delete refresh token from Redis
        await this.refreshTokenRepository.delete(request.userId);

        // 2. Add access token to blocklist (revoke)
        // Extract remaining TTL from token
        const payload = this.tokenService.decode(request.accessToken);
        if (payload) {
            // Assuming token has 15 minutes TTL, add to blocklist with same TTL
            await this.refreshTokenRepository.revoke(request.accessToken, 15 * 60);
        }
    }
}
