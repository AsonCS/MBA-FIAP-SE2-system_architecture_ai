import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITemplateRepository } from '../../../core/ports';
import { MessageTemplate } from '../../../core/domain/entities';
import { MessageTemplateEntity } from '../entities';
import { MessageTemplateMapper } from '../mappers';

@Injectable()
export class TypeOrmTemplateRepository implements ITemplateRepository {
    constructor(
        @InjectRepository(MessageTemplateEntity)
        private readonly repository: Repository<MessageTemplateEntity>,
    ) { }

    async findById(id: string): Promise<MessageTemplate | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? MessageTemplateMapper.toDomain(entity) : null;
    }

    async findByName(name: string): Promise<MessageTemplate | null> {
        const entity = await this.repository.findOne({ where: { name } });
        return entity ? MessageTemplateMapper.toDomain(entity) : null;
    }

    async save(template: MessageTemplate): Promise<void> {
        const entity = MessageTemplateMapper.toPersistence(template);
        await this.repository.save(entity);
    }

    async findAll(): Promise<MessageTemplate[]> {
        const entities = await this.repository.find();
        return entities.map(MessageTemplateMapper.toDomain);
    }
}
