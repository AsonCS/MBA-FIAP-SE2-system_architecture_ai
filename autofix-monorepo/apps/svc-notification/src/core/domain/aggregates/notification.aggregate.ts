import { EmailAddress, PhoneNumber, Priority } from '../value-objects';

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    BOUNCED = 'BOUNCED',
}

export enum NotificationChannel {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    WHATSAPP = 'WHATSAPP',
    PUSH = 'PUSH',
}

export interface NotificationRecipient {
    email?: EmailAddress;
    phone?: PhoneNumber;
    deviceToken?: string;
}

export interface ProviderResponse {
    providerId?: string;
    messageId?: string;
    error?: string;
    statusCode?: number;
    timestamp: Date;
}

export class Notification {
    private readonly id: string;
    private status: NotificationStatus;
    private readonly channel: NotificationChannel;
    private readonly recipient: NotificationRecipient;
    private readonly templateId: string;
    private readonly subject: string;
    private readonly body: string;
    private readonly priority: Priority;
    private readonly metadata: Record<string, any>;
    private readonly attempts: ProviderResponse[];
    private readonly createdAt: Date;
    private updatedAt: Date;
    private sentAt?: Date;
    private failedAt?: Date;

    constructor(
        id: string,
        channel: NotificationChannel,
        recipient: NotificationRecipient,
        templateId: string,
        subject: string,
        body: string,
        priority: Priority = new Priority(),
        metadata: Record<string, any> = {},
        status: NotificationStatus = NotificationStatus.PENDING,
        attempts: ProviderResponse[] = [],
        createdAt?: Date,
        updatedAt?: Date,
        sentAt?: Date,
        failedAt?: Date,
    ) {
        if (!id || id.trim().length === 0) {
            throw new Error('Notification ID cannot be empty');
        }
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID cannot be empty');
        }
        if (!subject || subject.trim().length === 0) {
            throw new Error('Subject cannot be empty');
        }
        if (!body || body.trim().length === 0) {
            throw new Error('Body cannot be empty');
        }

        this.validateRecipient(channel, recipient);

        this.id = id;
        this.status = status;
        this.channel = channel;
        this.recipient = recipient;
        this.templateId = templateId;
        this.subject = subject;
        this.body = body;
        this.priority = priority;
        this.metadata = metadata;
        this.attempts = attempts;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.sentAt = sentAt;
        this.failedAt = failedAt;
    }

    private validateRecipient(channel: NotificationChannel, recipient: NotificationRecipient): void {
        switch (channel) {
            case NotificationChannel.EMAIL:
                if (!recipient.email) {
                    throw new Error('Email recipient is required for EMAIL channel');
                }
                break;
            case NotificationChannel.SMS:
            case NotificationChannel.WHATSAPP:
                if (!recipient.phone) {
                    throw new Error('Phone recipient is required for SMS/WhatsApp channel');
                }
                break;
            case NotificationChannel.PUSH:
                if (!recipient.deviceToken) {
                    throw new Error('Device token is required for PUSH channel');
                }
                break;
        }
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getStatus(): NotificationStatus {
        return this.status;
    }

    getChannel(): NotificationChannel {
        return this.channel;
    }

    getRecipient(): NotificationRecipient {
        return { ...this.recipient };
    }

    getTemplateId(): string {
        return this.templateId;
    }

    getSubject(): string {
        return this.subject;
    }

    getBody(): string {
        return this.body;
    }

    getPriority(): Priority {
        return this.priority;
    }

    getMetadata(): Record<string, any> {
        return { ...this.metadata };
    }

    getAttempts(): ProviderResponse[] {
        return [...this.attempts];
    }

    getAttemptsCount(): number {
        return this.attempts.length;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getSentAt(): Date | undefined {
        return this.sentAt;
    }

    getFailedAt(): Date | undefined {
        return this.failedAt;
    }

    // Business logic methods
    isPending(): boolean {
        return this.status === NotificationStatus.PENDING;
    }

    isSent(): boolean {
        return this.status === NotificationStatus.SENT;
    }

    isFailed(): boolean {
        return this.status === NotificationStatus.FAILED;
    }

    isBounced(): boolean {
        return this.status === NotificationStatus.BOUNCED;
    }

    canRetry(maxAttempts: number = 3): boolean {
        return this.isPending() && this.getAttemptsCount() < maxAttempts;
    }

    markAsSent(providerResponse: ProviderResponse): void {
        if (!this.isPending()) {
            throw new Error(`Cannot mark notification as sent. Current status: ${this.status}`);
        }

        this.status = NotificationStatus.SENT;
        this.sentAt = new Date();
        this.updatedAt = new Date();
        this.attempts.push(providerResponse);
    }

    markAsFailed(providerResponse: ProviderResponse): void {
        this.status = NotificationStatus.FAILED;
        this.failedAt = new Date();
        this.updatedAt = new Date();
        this.attempts.push(providerResponse);
    }

    markAsBounced(providerResponse: ProviderResponse): void {
        this.status = NotificationStatus.BOUNCED;
        this.failedAt = new Date();
        this.updatedAt = new Date();
        this.attempts.push(providerResponse);
    }

    recordAttempt(providerResponse: ProviderResponse): void {
        this.attempts.push(providerResponse);
        this.updatedAt = new Date();
    }

    getLastAttempt(): ProviderResponse | undefined {
        return this.attempts.length > 0 ? this.attempts[this.attempts.length - 1] : undefined;
    }
}
