import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITenantRepository } from '@core/ports/tenant-repository.port';
import { TenantAggregate } from '@core/domain/entities/tenant.aggregate';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantMapper } from '../mappers/tenant.mapper';

@Injectable()
export class TypeOrmTenantRepository implements ITenantRepository {
    constructor(
        @InjectRepository(TenantEntity)
        private readonly repository: Repository<TenantEntity>,
    ) { }

    async findById(id: string): Promise<TenantAggregate | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? TenantMapper.toDomain(entity) : null;
    }

    async findByCNPJ(cnpj: string): Promise<TenantAggregate | null> {
        const entity = await this.repository.findOne({ where: { cnpj } });
        return entity ? TenantMapper.toDomain(entity) : null;
    }

    async save(tenant: TenantAggregate): Promise<void> {
        const entity = TenantMapper.toPersistence(tenant);
        await this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
