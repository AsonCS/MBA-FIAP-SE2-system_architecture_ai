import { UserAggregate } from '../domain/entities/User';
import { AuthToken } from '../domain/value-objects/AuthToken';

/**
 * Login Result
 * 
 * Resultado da operação de login contendo tokens e dados do usuário.
 */
export interface LoginResult {
    tokens: AuthToken;
    user: UserAggregate;
}

/**
 * Auth Repository Interface
 * 
 * Define o contrato para operações de autenticação.
 * Implementado na camada de infraestrutura.
 */
export interface IAuthRepository {
    /**
     * Autentica um usuário com email e senha
     * @param email - Email do usuário
     * @param password - Senha do usuário
     * @returns Tokens e dados do usuário autenticado
     * @throws Error se as credenciais forem inválidas
     */
    login(email: string, password: string): Promise<LoginResult>;

    /**
     * Realiza logout do usuário, revogando os tokens
     * @throws Error se houver problema ao revogar tokens
     */
    logout(): Promise<void>;

    /**
     * Renova o access token usando o refresh token
     * @param refreshToken - Refresh token válido
     * @returns Novo par de tokens
     * @throws Error se o refresh token for inválido ou expirado
     */
    refreshToken(refreshToken: string): Promise<AuthToken>;

    /**
     * Obtém o usuário atualmente autenticado
     * @returns Dados do usuário ou null se não autenticado
     */
    getCurrentUser(): Promise<UserAggregate | null>;
}
