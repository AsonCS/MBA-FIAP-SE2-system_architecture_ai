import { TenantAggregate, TenantStatus } from '@core/domain/entities/tenant.aggregate';
import { CNPJ } from '@core/domain/value-objects/cnpj.vo';
import { TenantEntity } from '../entities/tenant.entity';

export class TenantMapper {
    static toDomain(entity: TenantEntity): TenantAggregate {
        return TenantAggregate.reconstitute({
            id: entity.id,
            name: entity.name,
            cnpj: new CNPJ(entity.cnpj),
            status: entity.status as TenantStatus,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toPersistence(aggregate: TenantAggregate): TenantEntity {
        const entity = new TenantEntity();
        entity.id = aggregate.id;
        entity.name = aggregate.name;
        entity.cnpj = aggregate.cnpj.getValue();
        entity.status = aggregate.status;
        entity.createdAt = aggregate.createdAt;
        entity.updatedAt = aggregate.updatedAt;
        return entity;
    }
}
