import { CNPJ } from '../domain/value-objects/CNPJ';
import { Email } from '../domain/value-objects/Email';
import { IAuthRepository, RegisterInput } from '../repositories/IAuthRepository';

/**
 * Register Input DTO
 */
export interface RegisterUseCaseInput {
    tenantName: string;
    cnpj: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
    confirmPassword: string;
}

/**
 * Register Use Case
 *
 * Responsável por orquestrar o processo de cadastro de uma nova oficina.
 * Aplica validações de negócio usando Value Objects antes de delegar ao repositório.
 */
export class RegisterUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    /**
     * Executa o caso de uso de registro
     * @param input - Dados do novo usuário e da oficina
     * @throws Error se alguma validação falhar
     */
    async execute(input: RegisterUseCaseInput): Promise<void> {
        // Validar nome da oficina
        if (!input.tenantName.trim()) {
            throw new Error('Nome da oficina é obrigatório');
        }
        if (input.tenantName.trim().length < 2) {
            throw new Error('Nome da oficina deve ter no mínimo 2 caracteres');
        }

        // Validar CNPJ usando o Value Object
        if (!input.cnpj.trim()) {
            throw new Error('CNPJ é obrigatório');
        }
        if (!CNPJ.isValid(input.cnpj)) {
            throw new Error('CNPJ inválido');
        }

        // Validar nome do responsável
        if (!input.ownerName.trim()) {
            throw new Error('Nome do responsável é obrigatório');
        }
        if (input.ownerName.trim().length < 2) {
            throw new Error('Nome do responsável deve ter no mínimo 2 caracteres');
        }

        // Validar email usando o Value Object
        if (!input.ownerEmail.trim()) {
            throw new Error('Email é obrigatório');
        }
        if (!Email.isValid(input.ownerEmail.trim())) {
            throw new Error('Formato de email inválido');
        }

        // Validar senha
        if (!input.ownerPassword) {
            throw new Error('Senha é obrigatória');
        }
        if (input.ownerPassword.length < 8) {
            throw new Error('Senha deve ter no mínimo 8 caracteres');
        }

        // Validar confirmação de senha
        if (!input.confirmPassword) {
            throw new Error('Confirmação de senha é obrigatória');
        }
        if (input.ownerPassword !== input.confirmPassword) {
            throw new Error('As senhas não coincidem');
        }

        // Montar DTO limpo para o repositório
        const registerInput: RegisterInput = {
            tenantName: input.tenantName.trim(),
            cnpj: input.cnpj.replace(/\D/g, ''),
            ownerName: input.ownerName.trim(),
            ownerEmail: input.ownerEmail.trim().toLowerCase(),
            ownerPassword: input.ownerPassword,
        };

        // Delegar ao repositório
        try {
            await this.authRepository.register(registerInput);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao realizar cadastro. Tente novamente.');
        }
    }
}
