import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { IEventPublisher } from '../../../core/ports';
import { DomainEvent } from '../../../core/domain/events';

/**
 * KafkaEventPublisher
 * Publishes domain events to Kafka
 */
@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
    private producer: Producer;
    private readonly topicPrefix: string;

    constructor(private readonly configService: ConfigService) {
        const kafka = new Kafka({
            clientId: 'svc-work-order',
            brokers: this.configService.get<string>('KAFKA_BROKERS')?.split(',') || [
                'localhost:9092',
            ],
        });

        this.producer = kafka.producer();
        this.topicPrefix =
            this.configService.get<string>('KAFKA_TOPIC_PREFIX') || 'autofix';
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async publish(event: DomainEvent): Promise<void> {
        const topic = this.getTopicName(event.eventName);
        const message = {
            key: event.eventId,
            value: JSON.stringify(event.toJSON()),
            headers: {
                eventName: event.eventName,
                eventId: event.eventId,
                occurredOn: event.occurredOn.toISOString(),
            },
        };

        await this.producer.send({
            topic,
            messages: [message],
        });
    }

    async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.publish(event);
        }
    }

    private getTopicName(eventName: string): string {
        // Convert "WorkOrder.Created" to "autofix.work-order.created"
        const normalized = eventName
            .toLowerCase()
            .replace(/\./g, '.')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();

        return `${this.topicPrefix}.${normalized}`;
    }
}
