import { UserAggregate } from '../../core/domain/entities/User';
import { Email } from '../../core/domain/value-objects/Email';

/**
 * Login Response DTO
 * 
 * Estrutura de resposta da API de login do svc-auth
 */
export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        tenantId: string;
    };
}

/**
 * User Mapper
 * 
 * Responsável por converter entre DTOs da API e entidades de domínio.
 * Isola o domínio de mudanças no contrato da API.
 */
export class UserMapper {
    /**
     * Converte DTO da API para UserAggregate do domínio
     * @param dto - DTO retornado pela API
     * @returns UserAggregate
     */
    static toDomain(dto: LoginResponseDto['user']): UserAggregate {
        const email = Email.create(dto.email);

        return new UserAggregate(
            dto.id,
            email,
            dto.name,
            dto.role,
            dto.tenantId
        );
    }

    /**
     * Converte UserAggregate para formato de persistência/API
     * @param user - UserAggregate do domínio
     * @returns Objeto simples para serialização
     */
    static toDTO(user: UserAggregate) {
        return {
            id: user.id,
            email: user.email.value,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
        };
    }
}
