export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    tenantId: string;
}

export interface ITokenService {
    sign(payload: TokenPayload, expiresIn?: string): string;
    verify(token: string): TokenPayload;
    decode(token: string): TokenPayload | null;
}
