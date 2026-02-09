import { SendNotificationHandler } from './send-notification.handler';
import { SendNotificationCommand } from '../commands';
import { NotificationChannel } from '../../domain/aggregates';

export class SendWelcomeEmailHandler {
    constructor(private readonly sendNotificationHandler: SendNotificationHandler) { }

    async handle(event: { userId: string; email: string; name: string }): Promise<void> {
        const command = new SendNotificationCommand(
            NotificationChannel.EMAIL,
            'welcome-email',
            { email: event.email },
            {
                name: event.name,
                userId: event.userId,
            },
        );

        await this.sendNotificationHandler.execute(command);
    }
}
