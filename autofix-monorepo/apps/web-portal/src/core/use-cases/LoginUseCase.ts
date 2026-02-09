import { Email } from '../domain/value-objects/Email';
import { IAuthRepository, LoginResult } from '../repositories/IAuthRepository';

/**
 * Login Input DTO
 */
export interface LoginInput {
    email: string;
    password: string;
}

/**
 * Login Use Case
 * 
 * Responsável por orquestrar o processo de autenticação do usuário.
 * Aplica validações de negócio antes de delegar ao repositório.
 */
export class LoginUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    /**
     * Executa o caso de uso de login
     * @param input - Credenciais do usuário
     * @returns Tokens e dados do usuário autenticado
     * @throws Error se as credenciais forem inválidas ou se houver erro de validação
     */
    async execute(input: LoginInput): Promise<LoginResult> {
        // Validação de entrada
        if (!input.email || input.email.trim().length === 0) {
            throw new Error('Email é obrigatório');
        }

        if (!input.password || input.password.trim().length === 0) {
            throw new Error('Senha é obrigatória');
        }

        // Validação de senha (mínimo 8 caracteres conforme svc-auth)
        if (input.password.length < 8) {
            throw new Error('Senha deve ter no mínimo 8 caracteres');
        }

        // Validar formato do email usando Value Object
        try {
            Email.create(input.email);
        } catch (error) {
            throw new Error('Formato de email inválido');
        }

        // Delegar autenticação ao repositório
        try {
            const result = await this.authRepository.login(
                input.email,
                input.password
            );

            return result;
        } catch (error) {
            // Re-lançar erro com mensagem amigável
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao realizar login. Verifique suas credenciais.');
        }
    }
}
