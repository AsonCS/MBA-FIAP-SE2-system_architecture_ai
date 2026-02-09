import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

/**
 * ProductEntity (TypeORM)
 * Database entity for products with optimistic locking support
 */
@Entity('products')
export class ProductEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    id: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    sku: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    category: string;

    @Column({ type: 'int', default: 0 })
    availableStock: number;

    @Column({ type: 'int', default: 0 })
    reservedStock: number;

    @Column({ type: 'int', default: 0 })
    minStockLevel: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    averageCost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    sellingPrice: number;

    @Column({ type: 'varchar', length: 3, default: 'BRL' })
    currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    dimensionLength: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    dimensionWidth: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    dimensionHeight: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    dimensionUnit: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    supplierId: string;

    @VersionColumn()
    version: number;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
