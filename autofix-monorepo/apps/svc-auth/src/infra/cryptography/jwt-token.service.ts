import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { ITokenService, TokenPayload } from '@core/ports/token-service.port';

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(private readonly jwtService: JwtService) { }

    sign(payload: TokenPayload, expiresIn: StringValue = '15m'): string {
        return this.jwtService.sign(payload, { expiresIn });
    }

    verify(token: string): TokenPayload {
        return this.jwtService.verify<TokenPayload>(token);
    }

    decode(token: string): TokenPayload | null {
        return this.jwtService.decode<TokenPayload>(token);
    }
}
