export interface IRefreshTokenRepository {
    save(userId: string, token: string, ttl: number): Promise<void>;
    find(userId: string): Promise<string | null>;
    delete(userId: string): Promise<void>;
    isRevoked(token: string): Promise<boolean>;
    revoke(token: string, ttl: number): Promise<void>;
}
