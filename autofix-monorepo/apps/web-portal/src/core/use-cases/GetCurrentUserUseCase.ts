import { UserAggregate } from '../domain/entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

/**
 * Get Current User Use Case
 * 
 * Responsável por recuperar os dados do usuário atualmente autenticado.
 * Útil para hidratar o estado da aplicação ao carregar.
 */
export class GetCurrentUserUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    /**
     * Executa o caso de uso para obter usuário atual
     * @returns Dados do usuário autenticado ou null se não autenticado
     */
    async execute(): Promise<UserAggregate | null> {
        try {
            const user = await this.authRepository.getCurrentUser();
            return user;
        } catch (error) {
            // Se houver erro ao obter usuário, retornar null
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    }
}
