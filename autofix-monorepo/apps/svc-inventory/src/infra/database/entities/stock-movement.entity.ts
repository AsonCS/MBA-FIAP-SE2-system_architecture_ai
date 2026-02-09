import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * StockMovementEntity (TypeORM)
 * Immutable database entity for stock movements (Kardex)
 */
@Entity('stock_movements')
@Index(['sku', 'createdAt'])
@Index(['reference'])
export class StockMovementEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    id: string;

    @Column({ type: 'varchar', length: 20 })
    sku: string;

    @Column({ type: 'varchar', length: 20 })
    type: string; // IN, OUT, ADJUSTMENT

    @Column({ type: 'varchar', length: 50 })
    reason: string; // PURCHASE, WORK_ORDER, ADJUSTMENT, etc.

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'int' })
    balanceAfter: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    reference: string; // WorkOrder ID, Invoice Number, etc.

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'varchar', length: 100 })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;
}
