import { Injectable, Logger } from '@nestjs/common';
import { SendPasswordRecoveryHandler } from '../../../core/application/handlers';

@Injectable()
export class PasswordRecoveryRequestedConsumer {
    private readonly logger = new Logger(PasswordRecoveryRequestedConsumer.name);

    constructor(private readonly sendPasswordRecoveryHandler: SendPasswordRecoveryHandler) { }

    async consume(message: any): Promise<void> {
        try {
            const event = JSON.parse(message.value.toString());

            this.logger.log(`Processing PasswordRecoveryRequested event for user: ${event.userId}`);

            await this.sendPasswordRecoveryHandler.handle({
                userId: event.userId,
                email: event.email,
                resetToken: event.resetToken,
                expiresAt: new Date(event.expiresAt),
            });

            this.logger.log(`Successfully sent password recovery email to: ${event.email}`);
        } catch (error) {
            this.logger.error(`Failed to process PasswordRecoveryRequested event: ${error.message}`, error.stack);

            if (error.retryable) {
                throw error;
            }

            this.logger.warn(`Non-retryable error, skipping message: ${error.message}`);
        }
    }
}
