import { UserAggregate } from '@core/domain/entities/user.aggregate';
import { Email } from '@core/domain/value-objects/email.vo';
import { Password } from '@core/domain/value-objects/password.vo';
import { UserRole } from '@core/domain/value-objects/user-role.vo';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
    static toDomain(entity: UserEntity): UserAggregate {
        return UserAggregate.reconstitute({
            id: entity.id,
            email: new Email(entity.email),
            password: Password.fromHash(entity.password),
            role: entity.role as UserRole,
            tenantId: entity.tenantId,
            name: entity.name,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toPersistence(aggregate: UserAggregate): UserEntity {
        const entity = new UserEntity();
        entity.id = aggregate.id;
        entity.email = aggregate.email.getValue();
        entity.password = aggregate.password.getHashedValue();
        entity.role = aggregate.role;
        entity.tenantId = aggregate.tenantId;
        entity.name = aggregate.name;
        entity.isActive = aggregate.isActive;
        entity.createdAt = aggregate.createdAt;
        entity.updatedAt = aggregate.updatedAt;
        return entity;
    }
}
