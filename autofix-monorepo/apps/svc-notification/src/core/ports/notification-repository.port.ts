import { Notification, NotificationStatus } from '../domain/aggregates';

export interface INotificationRepository {
    save(notification: Notification): Promise<void>;
    findById(id: string): Promise<Notification | null>;
    updateStatus(id: string, status: NotificationStatus, metadata?: any): Promise<void>;
    findByRecipient(recipient: string, limit?: number): Promise<Notification[]>;
    findPendingNotifications(limit?: number): Promise<Notification[]>;
}
