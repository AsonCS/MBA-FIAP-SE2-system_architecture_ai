import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * WorkOrder TypeORM Entity
 * Persistence model for work orders with JSONB snapshots
 */
@Entity('work_orders')
@Index(['tenantId', 'orderNumber'], { unique: true })
@Index(['tenantId', 'status'])
@Index(['tenantId', 'createdAt'])
export class WorkOrderEntity {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    @Index()
    tenantId: string;

    @Column({ type: 'varchar', length: 50 })
    orderNumber: string;

    @Column({ type: 'jsonb' })
    customer: {
        customerId: string;
        name: string;
        email?: string;
        phone?: string;
        document?: string;
    };

    @Column({ type: 'jsonb' })
    vehicle: {
        vehicleId: string;
        licensePlate: string;
        make: string;
        model: string;
        year: number;
        vin?: string;
        color?: string;
        mileage?: number;
    };

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'jsonb' })
    items: Array<{
        id: string;
        type: 'PART' | 'SERVICE';
        description: string;
        quantity: number;
        unitPrice: number;
        discount: number;
        sku?: string;
        partName?: string;
        manufacturer?: string;
        serviceCode?: string;
        serviceName?: string;
        estimatedHours?: number;
        technicianId?: string;
    }>;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt?: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
