/**
 * AuthToken Value Object
 * 
 * Encapsula os tokens JWT de autenticação (access e refresh).
 * Garante imutabilidade e validação básica dos tokens.
 */
export class AuthToken {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string
    ) {
        if (!accessToken || accessToken.trim().length === 0) {
            throw new Error('Access token não pode ser vazio');
        }

        if (!refreshToken || refreshToken.trim().length === 0) {
            throw new Error('Refresh token não pode ser vazio');
        }
    }

    /**
     * Verifica se os tokens são iguais
     */
    equals(other: AuthToken): boolean {
        return (
            this.accessToken === other.accessToken &&
            this.refreshToken === other.refreshToken
        );
    }
}
