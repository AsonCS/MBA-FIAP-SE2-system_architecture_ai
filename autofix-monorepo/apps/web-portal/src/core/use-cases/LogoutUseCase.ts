import { IAuthRepository } from '../repositories/IAuthRepository';

/**
 * Logout Use Case
 * 
 * Responsável por realizar o logout do usuário,
 * revogando os tokens e limpando o estado de autenticação.
 */
export class LogoutUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    /**
     * Executa o caso de uso de logout
     * @throws Error se houver problema ao revogar tokens
     */
    async execute(): Promise<void> {
        try {
            await this.authRepository.logout();
        } catch (error) {
            // Log do erro mas não falha o logout no frontend
            console.error('Erro ao revogar tokens no backend:', error);

            // Mesmo com erro no backend, limpar estado local
            // O repositório deve limpar o localStorage independentemente
        }
    }
}
