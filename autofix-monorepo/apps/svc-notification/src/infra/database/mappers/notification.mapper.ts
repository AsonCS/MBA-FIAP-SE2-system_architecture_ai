import { Notification, NotificationChannel, NotificationStatus } from '../../../core/domain/aggregates';
import { EmailAddress, PhoneNumber, Priority, PriorityLevel } from '../../../core/domain/value-objects';
import { NotificationEntity } from '../entities';

export class NotificationMapper {
    static toDomain(entity: NotificationEntity): Notification {
        const recipient: any = {};

        if (entity.recipientEmail) {
            recipient.email = new EmailAddress(entity.recipientEmail);
        }
        if (entity.recipientPhone) {
            recipient.phone = new PhoneNumber(entity.recipientPhone);
        }
        if (entity.recipientDeviceToken) {
            recipient.deviceToken = entity.recipientDeviceToken;
        }

        return new Notification(
            entity.id,
            entity.channel as NotificationChannel,
            recipient,
            entity.templateId,
            entity.subject,
            entity.body,
            new Priority(entity.priority as PriorityLevel),
            entity.metadata || {},
            entity.status as NotificationStatus,
            entity.attempts || [],
            entity.createdAt,
            entity.updatedAt,
            entity.sentAt,
            entity.failedAt,
        );
    }

    static toPersistence(domain: Notification): NotificationEntity {
        const entity = new NotificationEntity();
        const recipient = domain.getRecipient();

        entity.id = domain.getId();
        entity.status = domain.getStatus();
        entity.channel = domain.getChannel();
        entity.recipientEmail = recipient.email?.getValue();
        entity.recipientPhone = recipient.phone?.getValue();
        entity.recipientDeviceToken = recipient.deviceToken;
        entity.templateId = domain.getTemplateId();
        entity.subject = domain.getSubject();
        entity.body = domain.getBody();
        entity.priority = domain.getPriority().getLevel();
        entity.metadata = domain.getMetadata();
        entity.attempts = domain.getAttempts();
        entity.createdAt = domain.getCreatedAt();
        entity.updatedAt = domain.getUpdatedAt();
        entity.sentAt = domain.getSentAt();
        entity.failedAt = domain.getFailedAt();

        return entity;
    }
}
