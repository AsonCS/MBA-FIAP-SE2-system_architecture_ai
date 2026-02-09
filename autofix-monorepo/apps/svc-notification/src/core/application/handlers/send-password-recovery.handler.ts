import { SendNotificationHandler } from './send-notification.handler';
import { SendNotificationCommand } from '../commands';
import { NotificationChannel } from '../../domain/aggregates';
import { Priority, PriorityLevel } from '../../domain/value-objects';

export class SendPasswordRecoveryHandler {
    constructor(private readonly sendNotificationHandler: SendNotificationHandler) { }

    async handle(event: {
        userId: string;
        email: string;
        resetToken: string;
        expiresAt: Date;
    }): Promise<void> {
        const command = new SendNotificationCommand(
            NotificationChannel.EMAIL,
            'password-recovery',
            { email: event.email },
            {
                userId: event.userId,
                resetToken: event.resetToken,
                resetLink: `${process.env.APP_URL}/reset-password?token=${event.resetToken}`,
                expiresAt: event.expiresAt,
            },
            new Priority(PriorityLevel.URGENT),
        );

        await this.sendNotificationHandler.execute(command);
    }
}
