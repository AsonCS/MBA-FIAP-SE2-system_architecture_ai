/**
 * IOutboxRepository Port
 * Defines the contract for outbox pattern implementation
 */
export interface OutboxMessage {
    id: string;
    eventId: string;
    eventName: string;
    payload: any;
    tenantId: string;
    createdAt: Date;
    processedAt?: Date;
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
    retryCount: number;
    error?: string;
}

export interface IOutboxRepository {
    /**
     * Saves an outbox message
     */
    save(message: OutboxMessage): Promise<void>;

    /**
     * Finds pending messages to be processed
     */
    findPending(limit?: number): Promise<OutboxMessage[]>;

    /**
     * Marks a message as processed
     */
    markAsProcessed(id: string): Promise<void>;

    /**
     * Marks a message as failed
     */
    markAsFailed(id: string, error: string): Promise<void>;

    /**
     * Increments retry count
     */
    incrementRetryCount(id: string): Promise<void>;

    /**
     * Deletes old processed messages (cleanup)
     */
    deleteOldProcessed(olderThan: Date): Promise<number>;
}
