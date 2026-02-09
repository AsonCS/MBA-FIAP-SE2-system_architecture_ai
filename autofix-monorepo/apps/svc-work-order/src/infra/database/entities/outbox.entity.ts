import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * Outbox TypeORM Entity
 * Implements the Outbox Pattern for reliable event publishing
 */
@Entity('outbox_messages')
@Index(['status', 'createdAt'])
@Index(['tenantId'])
export class OutboxEntity {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    eventId: string;

    @Column({ type: 'varchar', length: 100 })
    eventName: string;

    @Column({ type: 'jsonb' })
    payload: any;

    @Column({ type: 'varchar', length: 100 })
    tenantId: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    processedAt?: Date;

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status: 'PENDING' | 'PROCESSED' | 'FAILED';

    @Column({ type: 'int', default: 0 })
    retryCount: number;

    @Column({ type: 'text', nullable: true })
    error?: string;
}
