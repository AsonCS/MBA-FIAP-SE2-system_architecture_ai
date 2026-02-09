import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IOutboxRepository, OutboxMessage } from '../../../core/ports';
import { OutboxEntity } from '../entities';

/**
 * TypeOrmOutboxRepository
 * Implements IOutboxRepository using TypeORM
 */
@Injectable()
export class TypeOrmOutboxRepository implements IOutboxRepository {
    constructor(
        @InjectRepository(OutboxEntity)
        private readonly repository: Repository<OutboxEntity>,
    ) { }

    async save(message: OutboxMessage): Promise<void> {
        const entity = new OutboxEntity();
        entity.id = message.id;
        entity.eventId = message.eventId;
        entity.eventName = message.eventName;
        entity.payload = message.payload;
        entity.tenantId = message.tenantId;
        entity.createdAt = message.createdAt;
        entity.processedAt = message.processedAt;
        entity.status = message.status;
        entity.retryCount = message.retryCount;
        entity.error = message.error;

        await this.repository.save(entity);
    }

    async findPending(limit: number = 100): Promise<OutboxMessage[]> {
        const entities = await this.repository.find({
            where: { status: 'PENDING' },
            order: { createdAt: 'ASC' },
            take: limit,
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async markAsProcessed(id: string): Promise<void> {
        await this.repository.update(id, {
            status: 'PROCESSED',
            processedAt: new Date(),
        });
    }

    async markAsFailed(id: string, error: string): Promise<void> {
        await this.repository.update(id, {
            status: 'FAILED',
            error,
        });
    }

    async incrementRetryCount(id: string): Promise<void> {
        await this.repository.increment({ id }, 'retryCount', 1);
    }

    async deleteOldProcessed(olderThan: Date): Promise<number> {
        const result = await this.repository.delete({
            status: 'PROCESSED',
            processedAt: LessThan(olderThan),
        });

        return result.affected || 0;
    }

    private toDomain(entity: OutboxEntity): OutboxMessage {
        return {
            id: entity.id,
            eventId: entity.eventId,
            eventName: entity.eventName,
            payload: entity.payload,
            tenantId: entity.tenantId,
            createdAt: entity.createdAt,
            processedAt: entity.processedAt,
            status: entity.status,
            retryCount: entity.retryCount,
            error: entity.error,
        };
    }
}
