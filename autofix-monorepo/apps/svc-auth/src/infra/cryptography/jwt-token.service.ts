import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, TokenPayload } from '@core/ports/token-service.port';

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(private readonly jwtService: JwtService) { }

    sign(payload: TokenPayload, expiresIn: string = '15m'): string {
        return this.jwtService.sign(payload as any, { expiresIn });
    }

    verify(token: string): TokenPayload {
        return this.jwtService.verify<TokenPayload>(token);
    }

    decode(token: string): TokenPayload | null {
        return this.jwtService.decode<TokenPayload>(token);
    }
}
