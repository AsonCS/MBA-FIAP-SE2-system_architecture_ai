import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationChannel, NotificationStatus } from '../../domain/aggregates';
import { EmailAddress, PhoneNumber, Priority } from '../../domain/value-objects';
import { TemplateEngine } from '../../domain/services';
import {
    INotificationRepository,
    ITemplateRepository,
    IMailGateway,
    ISmsGateway,
    IWhatsAppGateway,
    IPushGateway,
} from '../../ports';
import { SendNotificationCommand } from '../commands';

export class SendNotificationHandler {
    constructor(
        private readonly notificationRepository: INotificationRepository,
        private readonly templateRepository: ITemplateRepository,
        private readonly templateEngine: TemplateEngine,
        private readonly mailGateway: IMailGateway,
        private readonly smsGateway: ISmsGateway,
        private readonly whatsAppGateway: IWhatsAppGateway,
        private readonly pushGateway: IPushGateway,
    ) { }

    async execute(command: SendNotificationCommand): Promise<string> {
        // 1. Load template
        const template = await this.templateRepository.findById(command.templateId);
        if (!template) {
            throw new Error(`Template not found: ${command.templateId}`);
        }

        // 2. Compile template with variables
        const content = this.templateEngine.compile(template, command.variables);

        // 3. Create notification aggregate
        const notificationId = uuidv4();
        const recipient = this.buildRecipient(command);

        const notification = new Notification(
            notificationId,
            command.channel,
            recipient,
            command.templateId,
            content.getSubject(),
            content.getBody(),
            command.priority || new Priority(),
            command.metadata || {},
        );

        // 4. Save initial state as PENDING
        await this.notificationRepository.save(notification);

        // 5. Send via appropriate gateway
        try {
            const providerId = await this.sendViaGateway(notification);

            // 6. Mark as sent
            notification.markAsSent({
                providerId,
                messageId: providerId,
                timestamp: new Date(),
            });

            await this.notificationRepository.save(notification);

            return notificationId;
        } catch (error) {
            // 7. Handle failure
            notification.markAsFailed({
                error: error.message,
                statusCode: error.statusCode || 500,
                timestamp: new Date(),
            });

            await this.notificationRepository.save(notification);

            // Re-throw for retry mechanism (Kafka will handle retry)
            throw error;
        }
    }

    private buildRecipient(command: SendNotificationCommand) {
        const recipient: any = {};

        if (command.recipient.email) {
            recipient.email = new EmailAddress(command.recipient.email);
        }
        if (command.recipient.phone) {
            recipient.phone = new PhoneNumber(command.recipient.phone);
        }
        if (command.recipient.deviceToken) {
            recipient.deviceToken = command.recipient.deviceToken;
        }

        return recipient;
    }

    private async sendViaGateway(notification: Notification): Promise<string> {
        const channel = notification.getChannel();
        const recipient = notification.getRecipient();

        switch (channel) {
            case NotificationChannel.EMAIL:
                if (!recipient.email) {
                    throw new Error('Email recipient is required');
                }
                return await this.mailGateway.send(
                    recipient.email,
                    notification.getSubject(),
                    notification.getBody(),
                );

            case NotificationChannel.SMS:
                if (!recipient.phone) {
                    throw new Error('Phone recipient is required');
                }
                return await this.smsGateway.send(
                    recipient.phone,
                    notification.getBody(),
                );

            case NotificationChannel.WHATSAPP:
                if (!recipient.phone) {
                    throw new Error('Phone recipient is required');
                }
                return await this.whatsAppGateway.send(
                    recipient.phone,
                    notification.getBody(),
                );

            case NotificationChannel.PUSH:
                if (!recipient.deviceToken) {
                    throw new Error('Device token is required');
                }
                return await this.pushGateway.send(
                    recipient.deviceToken,
                    notification.getSubject(),
                    notification.getBody(),
                    notification.getMetadata(),
                );

            default:
                throw new Error(`Unsupported channel: ${channel}`);
        }
    }
}
