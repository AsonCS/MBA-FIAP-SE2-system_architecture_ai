import { IAuthRepository, LoginResult } from '../../core/repositories/IAuthRepository';
import { AuthToken } from '../../core/domain/value-objects/AuthToken';
import { UserAggregate } from '../../core/domain/entities/User';
import { HttpClient } from '../http/HttpClient';
import { UserMapper, LoginResponseDto } from '../mappers/UserMapper';

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const;

/**
 * Auth Repository Implementation
 * 
 * Implementa IAuthRepository usando HTTP client para comunicação com svc-auth.
 * Gerencia persistência de tokens no localStorage.
 */
export class AuthRepository implements IAuthRepository {
    constructor(private readonly httpClient: HttpClient) { }

    /**
     * Autentica usuário via API
     */
    async login(email: string, password: string): Promise<LoginResult> {
        try {
            const response = await this.httpClient.post<LoginResponseDto>(
                '/auth/login',
                { email, password }
            );

            // Persistir tokens no localStorage
            this.saveTokens(response.accessToken, response.refreshToken);

            // Converter DTO para entidade de domínio
            const user = UserMapper.toDomain(response.user);

            // Persistir dados do usuário
            this.saveUserData(user);

            // Criar AuthToken value object
            const tokens = new AuthToken(
                response.accessToken,
                response.refreshToken
            );

            return { tokens, user };
        } catch (error: any) {
            // Tratar erros específicos da API
            if (error.status === 401) {
                throw new Error('Email ou senha inválidos');
            }

            if (error.status === 400) {
                throw new Error('Dados de login inválidos');
            }

            throw new Error('Erro ao realizar login. Tente novamente.');
        }
    }

    /**
     * Realiza logout revogando tokens
     */
    async logout(): Promise<void> {
        try {
            // Chamar endpoint de logout no backend
            await this.httpClient.post('/auth/logout');
        } catch (error) {
            // Log erro mas continua com limpeza local
            console.error('Erro ao revogar tokens no backend:', error);
        } finally {
            // Sempre limpar tokens locais
            this.clearTokens();
        }
    }

    /**
     * Renova access token usando refresh token
     */
    async refreshToken(refreshToken: string): Promise<AuthToken> {
        try {
            const response = await this.httpClient.post<{
                accessToken: string;
                refreshToken: string;
            }>('/auth/refresh', { refreshToken });

            // Atualizar tokens no localStorage
            this.saveTokens(response.accessToken, response.refreshToken);

            return new AuthToken(response.accessToken, response.refreshToken);
        } catch (error: any) {
            // Se refresh falhar, limpar tokens
            this.clearTokens();

            if (error.status === 401) {
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            throw new Error('Erro ao renovar sessão');
        }
    }

    /**
     * Obtém usuário atual do localStorage
     */
    async getCurrentUser(): Promise<UserAggregate | null> {
        try {
            const accessToken = this.getAccessToken();

            if (!accessToken) {
                return null;
            }

            // Recuperar dados do usuário do localStorage
            const userData = this.getUserData();

            if (!userData) {
                return null;
            }

            return userData;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }

    /**
     * Salva tokens no localStorage
     */
    private saveTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    /**
     * Salva dados do usuário no localStorage
     */
    private saveUserData(user: UserAggregate): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user.toJSON()));
    }

    /**
     * Recupera dados do usuário do localStorage
     */
    private getUserData(): UserAggregate | null {
        if (typeof window === 'undefined') return null;

        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (!userData) {
            return null;
        }

        try {
            const parsed = JSON.parse(userData);
            return UserMapper.toDomain(parsed);
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            return null;
        }
    }

    /**
     * Obtém access token do localStorage
     */
    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    /**
     * Obtém refresh token do localStorage
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Limpa todos os tokens e dados do usuário
     */
    private clearTokens(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
}
