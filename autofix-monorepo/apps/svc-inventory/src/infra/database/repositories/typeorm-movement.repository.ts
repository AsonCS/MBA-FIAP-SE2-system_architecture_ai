import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IMovementRepository } from '../../../core/ports/movement.repository.interface';
import { StockMovement, MovementType, MovementReason } from '../../../core/domain/entities/stock-movement.entity';
import { StockMovementEntity } from '../entities/stock-movement.entity';

/**
 * TypeOrmMovementRepository
 * Implementation of IMovementRepository using TypeORM
 */
@Injectable()
export class TypeOrmMovementRepository implements IMovementRepository {
    constructor(
        @InjectRepository(StockMovementEntity)
        private readonly repository: Repository<StockMovementEntity>,
    ) { }

    async log(movement: StockMovement): Promise<void> {
        const entity = this.toEntity(movement);
        await this.repository.save(entity);
    }

    async findBySku(
        sku: string,
        page: number,
        limit: number,
    ): Promise<StockMovement[]> {
        const entities = await this.repository.find({
            where: { sku },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async findByReference(reference: string): Promise<StockMovement[]> {
        const entities = await this.repository.find({
            where: { reference },
            order: { createdAt: 'DESC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async findByDateRange(
        sku: string,
        startDate: Date,
        endDate: Date,
    ): Promise<StockMovement[]> {
        const entities = await this.repository.find({
            where: {
                sku,
                createdAt: Between(startDate, endDate),
            },
            order: { createdAt: 'ASC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async findAll(page: number, limit: number): Promise<StockMovement[]> {
        const entities = await this.repository.find({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    // Mappers
    private toDomain(entity: StockMovementEntity): StockMovement {
        return StockMovement.reconstitute({
            id: entity.id,
            sku: entity.sku,
            type: entity.type as MovementType,
            reason: entity.reason as MovementReason,
            quantity: entity.quantity,
            balanceAfter: entity.balanceAfter,
            cost: entity.cost,
            reference: entity.reference,
            notes: entity.notes,
            createdBy: entity.createdBy,
            createdAt: entity.createdAt,
        });
    }

    private toEntity(movement: StockMovement): StockMovementEntity {
        const entity = new StockMovementEntity();
        entity.id = movement.getId();
        entity.sku = movement.getSku();
        entity.type = movement.getType();
        entity.reason = movement.getReason();
        entity.quantity = movement.getQuantity();
        entity.balanceAfter = movement.getBalanceAfter();
        entity.cost = movement.getCost();
        entity.reference = movement.getReference();
        entity.notes = movement.getNotes();
        entity.createdBy = movement.getCreatedBy();
        entity.createdAt = movement.getCreatedAt();

        return entity;
    }
}
