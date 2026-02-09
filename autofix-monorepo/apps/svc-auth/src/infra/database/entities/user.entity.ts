import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TenantEntity } from './tenant.entity';

@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ['OWNER', 'ADMIN', 'MECHANIC', 'RECEPTIONIST'],
    })
    role: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @ManyToOne(() => TenantEntity)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantEntity;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
