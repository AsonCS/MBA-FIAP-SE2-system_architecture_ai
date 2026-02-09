import { SendNotificationHandler } from './send-notification.handler';
import { SendNotificationCommand } from '../commands';
import { NotificationChannel } from '../../domain/aggregates';

export class NotifyOrderStatusHandler {
    constructor(private readonly sendNotificationHandler: SendNotificationHandler) { }

    async handle(event: {
        orderId: string;
        customerPhone: string;
        customerName: string;
        status: string;
        estimatedCompletion?: Date;
    }): Promise<void> {
        const command = new SendNotificationCommand(
            NotificationChannel.WHATSAPP,
            'order-status-update',
            { phone: event.customerPhone },
            {
                customerName: event.customerName,
                orderId: event.orderId,
                status: event.status,
                estimatedCompletion: event.estimatedCompletion,
            },
        );

        await this.sendNotificationHandler.execute(command);
    }
}
