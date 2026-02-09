import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../../core/ports/product.repository.interface';
import { Product } from '../../../core/domain/aggregates/product.aggregate';
import { SKU } from '../../../core/domain/value-objects/sku.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import { Money } from '../../../core/domain/value-objects/money.vo';
import { Dimensions } from '../../../core/domain/value-objects/dimensions.vo';
import { ProductEntity } from '../entities/product.entity';
import { OptimisticLockError } from '../../../core/domain/exceptions/domain.exceptions';

/**
 * TypeOrmProductRepository
 * Implementation of IProductRepository using TypeORM
 */
@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
    ) { }

    async findBySku(sku: SKU): Promise<Product | null> {
        const entity = await this.repository.findOne({
            where: { sku: sku.getValue(), active: true },
        });

        return entity ? this.toDomain(entity) : null;
    }

    async findById(id: string): Promise<Product | null> {
        const entity = await this.repository.findOne({
            where: { id, active: true },
        });

        return entity ? this.toDomain(entity) : null;
    }

    async findAll(page: number, limit: number): Promise<Product[]> {
        const entities = await this.repository.find({
            where: { active: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { name: 'ASC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async findByCategory(category: string): Promise<Product[]> {
        const entities = await this.repository.find({
            where: { category, active: true },
            order: { name: 'ASC' },
        });

        return entities.map((entity) => this.toDomain(entity));
    }

    async findLowStock(): Promise<Product[]> {
        const entities = await this.repository
            .createQueryBuilder('product')
            .where('product.active = :active', { active: true })
            .andWhere('product.availableStock < product.minStockLevel')
            .orderBy('product.availableStock', 'ASC')
            .getMany();

        return entities.map((entity) => this.toDomain(entity));
    }

    async save(product: Product, expectedVersion: number): Promise<void> {
        const entity = this.toEntity(product);

        // Optimistic locking check
        const result = await this.repository
            .createQueryBuilder()
            .update(ProductEntity)
            .set({
                availableStock: entity.availableStock,
                reservedStock: entity.reservedStock,
                averageCost: entity.averageCost,
                sellingPrice: entity.sellingPrice,
                updatedAt: new Date(),
                version: expectedVersion + 1,
            })
            .where('id = :id', { id: entity.id })
            .andWhere('version = :version', { version: expectedVersion })
            .execute();

        if (result.affected === 0) {
            // Version mismatch - optimistic lock failed
            const current = await this.repository.findOne({
                where: { id: entity.id },
            });
            throw new OptimisticLockError(
                product.getSku().getValue(),
                expectedVersion,
                current?.version || -1,
            );
        }

        // Increment version in the domain object
        product.incrementVersion();
    }

    async create(product: Product): Promise<void> {
        const entity = this.toEntity(product);
        await this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.update(id, { active: false });
    }

    async existsBySku(sku: SKU): Promise<boolean> {
        const count = await this.repository.count({
            where: { sku: sku.getValue(), active: true },
        });
        return count > 0;
    }

    // Mappers
    private toDomain(entity: ProductEntity): Product {
        const dimensions =
            entity.dimensionLength && entity.dimensionWidth && entity.dimensionHeight
                ? Dimensions.create(
                    entity.dimensionLength,
                    entity.dimensionWidth,
                    entity.dimensionHeight,
                    entity.dimensionUnit || 'cm',
                )
                : undefined;

        return Product.reconstitute({
            id: entity.id,
            sku: SKU.create(entity.sku),
            name: entity.name,
            description: entity.description,
            category: entity.category,
            availableStock: Quantity.create(entity.availableStock),
            reservedStock: Quantity.create(entity.reservedStock),
            minStockLevel: Quantity.create(entity.minStockLevel),
            averageCost: Money.create(entity.averageCost, entity.currency),
            sellingPrice: Money.create(entity.sellingPrice, entity.currency),
            dimensions,
            supplierId: entity.supplierId,
            version: entity.version,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    private toEntity(product: Product): ProductEntity {
        const entity = new ProductEntity();
        entity.id = product.getId();
        entity.sku = product.getSku().getValue();
        entity.name = product.getName();
        entity.description = product.getDescription();
        entity.category = product.getCategory();
        entity.availableStock = product.getAvailableStock().getValue();
        entity.reservedStock = product.getReservedStock().getValue();
        entity.minStockLevel = product.getMinStockLevel().getValue();
        entity.averageCost = product.getAverageCost().getAmount();
        entity.sellingPrice = product.getSellingPrice().getAmount();
        entity.currency = product.getSellingPrice().getCurrency();

        const dimensions = product.getDimensions();
        if (dimensions) {
            entity.dimensionLength = dimensions.getLength();
            entity.dimensionWidth = dimensions.getWidth();
            entity.dimensionHeight = dimensions.getHeight();
            entity.dimensionUnit = dimensions.getUnit();
        }

        entity.supplierId = product.getSupplierId();
        entity.version = product.getVersion();
        entity.active = product.isActive();
        entity.createdAt = product.getCreatedAt();
        entity.updatedAt = product.getUpdatedAt();

        return entity;
    }
}
