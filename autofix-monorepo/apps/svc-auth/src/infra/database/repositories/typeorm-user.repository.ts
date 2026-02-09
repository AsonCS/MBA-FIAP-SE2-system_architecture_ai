import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@core/ports/user-repository.port';
import { UserAggregate } from '@core/domain/entities/user.aggregate';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) { }

    async findById(id: string): Promise<UserAggregate | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByEmail(email: string): Promise<UserAggregate | null> {
        const entity = await this.repository.findOne({ where: { email } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByTenantId(tenantId: string): Promise<UserAggregate[]> {
        const entities = await this.repository.find({ where: { tenantId } });
        return entities.map(UserMapper.toDomain);
    }

    async save(user: UserAggregate): Promise<void> {
        const entity = UserMapper.toPersistence(user);
        await this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
