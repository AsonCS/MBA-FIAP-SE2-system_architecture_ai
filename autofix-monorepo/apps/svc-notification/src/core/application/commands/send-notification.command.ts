import { NotificationChannel } from '../../domain/aggregates';
import { EmailAddress, PhoneNumber, Priority } from '../../domain/value-objects';

export class SendNotificationCommand {
    constructor(
        public readonly channel: NotificationChannel,
        public readonly templateId: string,
        public readonly recipient: {
            email?: string;
            phone?: string;
            deviceToken?: string;
        },
        public readonly variables: Record<string, any>,
        public readonly priority?: Priority,
        public readonly metadata?: Record<string, any>,
    ) { }

    getEmailAddress(): EmailAddress | undefined {
        return this.recipient.email ? new EmailAddress(this.recipient.email) : undefined;
    }

    getPhoneNumber(): PhoneNumber | undefined {
        return this.recipient.phone ? new PhoneNumber(this.recipient.phone) : undefined;
    }
}
