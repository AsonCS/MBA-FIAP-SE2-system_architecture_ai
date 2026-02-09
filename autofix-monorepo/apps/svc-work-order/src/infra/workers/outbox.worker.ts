import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IOutboxRepository, IEventPublisher } from '../../../core/ports';
import { DomainEvent } from '../../../core/domain/events';

/**
 * OutboxWorker
 * Background worker that processes outbox messages and publishes them to Kafka
 * Implements the Outbox Pattern for reliable event publishing
 */
@Injectable()
export class OutboxWorker {
    private readonly logger = new Logger(OutboxWorker.name);
    private readonly MAX_RETRIES = 5;
    private isProcessing = false;

    constructor(
        private readonly outboxRepository: IOutboxRepository,
        private readonly eventPublisher: IEventPublisher,
    ) { }

    /**
     * Processes pending outbox messages every 5 seconds
     */
    @Cron(CronExpression.EVERY_5_SECONDS)
    async processOutboxMessages(): Promise<void> {
        if (this.isProcessing) {
            this.logger.debug('Already processing outbox messages, skipping...');
            return;
        }

        this.isProcessing = true;

        try {
            const pendingMessages = await this.outboxRepository.findPending(100);

            if (pendingMessages.length === 0) {
                return;
            }

            this.logger.log(
                `Processing ${pendingMessages.length} pending outbox messages`,
            );

            for (const message of pendingMessages) {
                try {
                    // Check if max retries exceeded
                    if (message.retryCount >= this.MAX_RETRIES) {
                        this.logger.error(
                            `Message ${message.id} exceeded max retries, marking as failed`,
                        );
                        await this.outboxRepository.markAsFailed(
                            message.id,
                            'Max retries exceeded',
                        );
                        continue;
                    }

                    // Reconstruct domain event from payload
                    const event = this.reconstructEvent(message.payload);

                    // Publish to Kafka
                    await this.eventPublisher.publish(event);

                    // Mark as processed
                    await this.outboxRepository.markAsProcessed(message.id);

                    this.logger.log(
                        `Successfully published event ${message.eventName} (${message.id})`,
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to process message ${message.id}: ${error.message}`,
                        error.stack,
                    );

                    // Increment retry count
                    await this.outboxRepository.incrementRetryCount(message.id);

                    // If this was the last retry, mark as failed
                    if (message.retryCount + 1 >= this.MAX_RETRIES) {
                        await this.outboxRepository.markAsFailed(
                            message.id,
                            error.message,
                        );
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                `Error processing outbox messages: ${error.message}`,
                error.stack,
            );
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Cleans up old processed messages (runs daily at midnight)
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupOldMessages(): Promise<void> {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const deletedCount = await this.outboxRepository.deleteOldProcessed(
                sevenDaysAgo,
            );

            if (deletedCount > 0) {
                this.logger.log(`Cleaned up ${deletedCount} old processed messages`);
            }
        } catch (error) {
            this.logger.error(
                `Error cleaning up old messages: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Reconstructs a domain event from the stored payload
     */
    private reconstructEvent(payload: any): DomainEvent {
        // Create a simple wrapper that implements DomainEvent interface
        return {
            eventId: payload.eventId,
            eventName: payload.eventName,
            occurredOn: new Date(payload.occurredOn),
            toJSON: () => payload,
        } as DomainEvent;
    }
}
