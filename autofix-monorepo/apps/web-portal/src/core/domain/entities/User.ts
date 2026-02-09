import { Email } from '../value-objects/Email';

/**
 * User Aggregate
 * 
 * Representa o usuário autenticado no sistema.
 * Raiz do agregado de autenticação.
 */
export class UserAggregate {
    constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly name: string,
        public readonly role: string,
        public readonly tenantId: string
    ) {
        if (!id || id.trim().length === 0) {
            throw new Error('User ID não pode ser vazio');
        }

        if (!name || name.trim().length === 0) {
            throw new Error('Nome do usuário não pode ser vazio');
        }

        if (!role || role.trim().length === 0) {
            throw new Error('Role do usuário não pode ser vazio');
        }

        if (!tenantId || tenantId.trim().length === 0) {
            throw new Error('Tenant ID não pode ser vazio');
        }
    }

    /**
     * Verifica se o usuário tem uma role específica
     */
    hasRole(role: string): boolean {
        return this.role === role;
    }

    /**
     * Verifica se é o mesmo usuário
     */
    equals(other: UserAggregate): boolean {
        return this.id === other.id;
    }

    /**
     * Retorna representação simplificada para serialização
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email.value,
            name: this.name,
            role: this.role,
            tenantId: this.tenantId,
        };
    }
}
