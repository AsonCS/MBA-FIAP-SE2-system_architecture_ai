import { Injectable, Logger } from '@nestjs/common';
import { SendWelcomeEmailHandler } from '../../../core/application/handlers';

@Injectable()
export class UserRegisteredConsumer {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(private readonly sendWelcomeEmailHandler: SendWelcomeEmailHandler) { }

    async consume(message: any): Promise<void> {
        try {
            const event = JSON.parse(message.value.toString());

            this.logger.log(`Processing UserRegistered event for user: ${event.userId}`);

            await this.sendWelcomeEmailHandler.handle({
                userId: event.userId,
                email: event.email,
                name: event.name,
            });

            this.logger.log(`Successfully sent welcome email to: ${event.email}`);
        } catch (error) {
            this.logger.error(`Failed to process UserRegistered event: ${error.message}`, error.stack);

            // Re-throw to trigger Kafka retry mechanism
            if (error.retryable) {
                throw error;
            }

            // For non-retryable errors, log and continue (will be sent to DLQ if configured)
            this.logger.warn(`Non-retryable error, skipping message: ${error.message}`);
        }
    }
}
