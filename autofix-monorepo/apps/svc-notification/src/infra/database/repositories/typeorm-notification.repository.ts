import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INotificationRepository } from '../../../core/ports';
import { Notification, NotificationStatus } from '../../../core/domain/aggregates';
import { NotificationEntity } from '../entities';
import { NotificationMapper } from '../mappers';

@Injectable()
export class TypeOrmNotificationRepository implements INotificationRepository {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly repository: Repository<NotificationEntity>,
    ) { }

    async save(notification: Notification): Promise<void> {
        const entity = NotificationMapper.toPersistence(notification);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<Notification | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? NotificationMapper.toDomain(entity) : null;
    }

    async updateStatus(id: string, status: NotificationStatus, metadata?: any): Promise<void> {
        const updateData: any = { status, updatedAt: new Date() };

        if (status === NotificationStatus.SENT) {
            updateData.sentAt = new Date();
        } else if (status === NotificationStatus.FAILED || status === NotificationStatus.BOUNCED) {
            updateData.failedAt = new Date();
        }

        if (metadata) {
            updateData.metadata = metadata;
        }

        await this.repository.update(id, updateData);
    }

    async findByRecipient(recipient: string, limit: number = 50): Promise<Notification[]> {
        const entities = await this.repository.find({
            where: [
                { recipientEmail: recipient },
                { recipientPhone: recipient },
                { recipientDeviceToken: recipient },
            ],
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return entities.map(NotificationMapper.toDomain);
    }

    async findPendingNotifications(limit: number = 100): Promise<Notification[]> {
        const entities = await this.repository.find({
            where: { status: NotificationStatus.PENDING },
            order: { createdAt: 'ASC' },
            take: limit,
        });

        return entities.map(NotificationMapper.toDomain);
    }
}
