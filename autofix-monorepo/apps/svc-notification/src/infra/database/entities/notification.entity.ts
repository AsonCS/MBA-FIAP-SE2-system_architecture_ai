import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'SENT', 'FAILED', 'BOUNCED'],
    })
    status: string;

    @Column({
        type: 'enum',
        enum: ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'],
    })
    channel: string;

    @Column({ type: 'varchar', nullable: true })
    recipientEmail?: string;

    @Column({ type: 'varchar', nullable: true })
    recipientPhone?: string;

    @Column({ type: 'varchar', nullable: true })
    recipientDeviceToken?: string;

    @Column({ type: 'varchar' })
    templateId: string;

    @Column({ type: 'varchar' })
    subject: string;

    @Column({ type: 'text' })
    body: string;

    @Column({ type: 'varchar', default: 'MEDIUM' })
    priority: string;

    @Column({ type: 'jsonb', default: {} })
    metadata: Record<string, any>;

    @Column({ type: 'jsonb', default: [] })
    attempts: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    sentAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    failedAt?: Date;
}
