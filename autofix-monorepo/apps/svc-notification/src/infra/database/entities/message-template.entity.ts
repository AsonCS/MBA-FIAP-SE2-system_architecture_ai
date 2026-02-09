import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('message_templates')
export class MessageTemplateEntity {
    @PrimaryColumn('varchar')
    id: string;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'varchar' })
    subject: string;

    @Column({ type: 'text' })
    body: string;

    @Column({ type: 'jsonb', default: [] })
    requiredVariables: string[];

    @Column({
        type: 'enum',
        enum: ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'],
    })
    channel: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
