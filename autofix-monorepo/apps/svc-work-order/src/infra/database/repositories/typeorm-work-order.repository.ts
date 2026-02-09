import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IWorkOrderRepository, FindAllOptions, CountFilters } from '../../../core/ports';
import { WorkOrder } from '../../../core/domain/aggregates';
import { WorkOrderEntity } from '../entities';
import { WorkOrderMapper } from '../mappers';

/**
 * TypeOrmWorkOrderRepository
 * Implements IWorkOrderRepository using TypeORM
 */
@Injectable()
export class TypeOrmWorkOrderRepository implements IWorkOrderRepository {
    constructor(
        @InjectRepository(WorkOrderEntity)
        private readonly repository: Repository<WorkOrderEntity>,
    ) { }

    async save(workOrder: WorkOrder): Promise<void> {
        const entity = WorkOrderMapper.toEntity(workOrder);
        await this.repository.save(entity);
    }

    async findById(id: string, tenantId: string): Promise<WorkOrder | null> {
        const entity = await this.repository.findOne({
            where: { id, tenantId, deleted: false },
        });

        return entity ? WorkOrderMapper.toDomain(entity) : null;
    }

    async findByOrderNumber(
        orderNumber: string,
        tenantId: string,
    ): Promise<WorkOrder | null> {
        const entity = await this.repository.findOne({
            where: { orderNumber, tenantId, deleted: false },
        });

        return entity ? WorkOrderMapper.toDomain(entity) : null;
    }

    async findAll(
        tenantId: string,
        options?: FindAllOptions,
    ): Promise<WorkOrder[]> {
        const queryBuilder = this.repository
            .createQueryBuilder('wo')
            .where('wo.tenantId = :tenantId', { tenantId })
            .andWhere('wo.deleted = :deleted', { deleted: false });

        if (options?.status) {
            queryBuilder.andWhere('wo.status = :status', { status: options.status });
        }

        if (options?.customerId) {
            queryBuilder.andWhere("wo.customer->>'customerId' = :customerId", {
                customerId: options.customerId,
            });
        }

        if (options?.vehicleId) {
            queryBuilder.andWhere("wo.vehicle->>'vehicleId' = :vehicleId", {
                vehicleId: options.vehicleId,
            });
        }

        if (options?.dateFrom) {
            queryBuilder.andWhere('wo.createdAt >= :dateFrom', {
                dateFrom: options.dateFrom,
            });
        }

        if (options?.dateTo) {
            queryBuilder.andWhere('wo.createdAt <= :dateTo', {
                dateTo: options.dateTo,
            });
        }

        if (options?.sortBy) {
            queryBuilder.orderBy(
                `wo.${options.sortBy}`,
                options.sortOrder || 'DESC',
            );
        }

        if (options?.limit) {
            queryBuilder.limit(options.limit);
        }

        if (options?.offset) {
            queryBuilder.offset(options.offset);
        }

        const entities = await queryBuilder.getMany();
        return entities.map((entity) => WorkOrderMapper.toDomain(entity));
    }

    async findByCustomerId(
        customerId: string,
        tenantId: string,
    ): Promise<WorkOrder[]> {
        const entities = await this.repository
            .createQueryBuilder('wo')
            .where('wo.tenantId = :tenantId', { tenantId })
            .andWhere('wo.deleted = :deleted', { deleted: false })
            .andWhere("wo.customer->>'customerId' = :customerId", { customerId })
            .orderBy('wo.createdAt', 'DESC')
            .getMany();

        return entities.map((entity) => WorkOrderMapper.toDomain(entity));
    }

    async findByVehicleId(
        vehicleId: string,
        tenantId: string,
    ): Promise<WorkOrder[]> {
        const entities = await this.repository
            .createQueryBuilder('wo')
            .where('wo.tenantId = :tenantId', { tenantId })
            .andWhere('wo.deleted = :deleted', { deleted: false })
            .andWhere("wo.vehicle->>'vehicleId' = :vehicleId", { vehicleId })
            .orderBy('wo.createdAt', 'DESC')
            .getMany();

        return entities.map((entity) => WorkOrderMapper.toDomain(entity));
    }

    async findByStatus(status: string, tenantId: string): Promise<WorkOrder[]> {
        const entities = await this.repository.find({
            where: { status, tenantId, deleted: false },
            order: { createdAt: 'DESC' },
        });

        return entities.map((entity) => WorkOrderMapper.toDomain(entity));
    }

    async delete(id: string, tenantId: string): Promise<void> {
        await this.repository.update(
            { id, tenantId },
            { deleted: true, updatedAt: new Date() },
        );
    }

    async count(tenantId: string, filters?: CountFilters): Promise<number> {
        const queryBuilder = this.repository
            .createQueryBuilder('wo')
            .where('wo.tenantId = :tenantId', { tenantId })
            .andWhere('wo.deleted = :deleted', { deleted: false });

        if (filters?.status) {
            queryBuilder.andWhere('wo.status = :status', { status: filters.status });
        }

        if (filters?.customerId) {
            queryBuilder.andWhere("wo.customer->>'customerId' = :customerId", {
                customerId: filters.customerId,
            });
        }

        if (filters?.vehicleId) {
            queryBuilder.andWhere("wo.vehicle->>'vehicleId' = :vehicleId", {
                vehicleId: filters.vehicleId,
            });
        }

        if (filters?.dateFrom) {
            queryBuilder.andWhere('wo.createdAt >= :dateFrom', {
                dateFrom: filters.dateFrom,
            });
        }

        if (filters?.dateTo) {
            queryBuilder.andWhere('wo.createdAt <= :dateTo', {
                dateTo: filters.dateTo,
            });
        }

        return await queryBuilder.getCount();
    }
}
