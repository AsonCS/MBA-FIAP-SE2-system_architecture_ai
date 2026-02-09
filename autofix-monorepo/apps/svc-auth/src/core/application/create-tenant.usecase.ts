import { ITenantRepository } from '../ports/tenant-repository.port';
import { IUserRepository } from '../ports/user-repository.port';
import { IHasher } from '../ports/hasher.port';
import { IEventPublisher } from '../ports/event-publisher.port';
import { TenantAggregate } from '../domain/entities/tenant.aggregate';
import { UserAggregate } from '../domain/entities/user.aggregate';
import { CNPJ } from '../domain/value-objects/cnpj.vo';
import { Email } from '../domain/value-objects/email.vo';
import { Password } from '../domain/value-objects/password.vo';
import { UserRole } from '../domain/value-objects/user-role.vo';
import { TenantCreatedEvent, UserRegisteredEvent } from '../domain/events/domain-events';
import { DuplicateCNPJError, DuplicateEmailError } from '../domain/exceptions/domain-exceptions';

export interface CreateTenantRequest {
    tenantName: string;
    cnpj: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
}

export interface CreateTenantResponse {
    tenantId: string;
    userId: string;
}

export class CreateTenantUseCase {
    constructor(
        private readonly tenantRepository: ITenantRepository,
        private readonly userRepository: IUserRepository,
        private readonly hasher: IHasher,
        private readonly eventPublisher: IEventPublisher,
    ) { }

    async execute(request: CreateTenantRequest): Promise<CreateTenantResponse> {
        // 1. Validate CNPJ uniqueness
        const cnpj = new CNPJ(request.cnpj);
        const existingTenant = await this.tenantRepository.findByCNPJ(cnpj.getValue());
        if (existingTenant) {
            throw new DuplicateCNPJError(cnpj.getValue());
        }

        // 2. Validate email uniqueness
        const email = new Email(request.ownerEmail);
        const existingUser = await this.userRepository.findByEmail(email.getValue());
        if (existingUser) {
            throw new DuplicateEmailError(email.getValue());
        }

        // 3. Create tenant
        const tenant = TenantAggregate.create({
            name: request.tenantName,
            cnpj,
        });

        // 4. Hash password
        const hashedPassword = await this.hasher.hash(request.ownerPassword);
        const password = Password.fromHash(hashedPassword);

        // 5. Create owner user
        const owner = UserAggregate.create({
            email,
            password,
            role: UserRole.OWNER,
            tenantId: tenant.id,
            name: request.ownerName,
        });

        // 6. Save entities (atomic operation - should be in transaction)
        try {
            await this.tenantRepository.save(tenant);
            await this.userRepository.save(owner);
        } catch (error) {
            // Rollback logic should be handled by infrastructure layer
            throw error;
        }

        // 7. Publish domain events
        const events = [
            new TenantCreatedEvent(tenant.id, tenant.name, tenant.cnpj.getValue()),
            new UserRegisteredEvent(owner.id, owner.email.getValue(), owner.name, tenant.id),
        ];
        await this.eventPublisher.publishMany(events);

        return {
            tenantId: tenant.id,
            userId: owner.id,
        };
    }
}
