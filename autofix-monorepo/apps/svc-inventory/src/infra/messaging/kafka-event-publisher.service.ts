import { Injectable } from '@nestjs/common';
import { IEventPublisher } from '../../../core/ports/event.interface';
import { DomainEvent } from '../../../core/domain/events/domain-event.base';
import { Kafka, Producer } from 'kafkajs';

/**
 * KafkaEventPublisher
 * Implementation of IEventPublisher using Kafka
 */
@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
    private readonly kafka: Kafka;
    private producer: Producer;
    private readonly topic = 'inventory.events';

    constructor() {
        this.kafka = new Kafka({
            clientId: 'svc-inventory',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        });

        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async publish(event: DomainEvent): Promise<void> {
        await this.producer.send({
            topic: this.topic,
            messages: [
                {
                    key: event.getEventName(),
                    value: JSON.stringify({
                        eventId: event.eventId,
                        eventName: event.getEventName(),
                        occurredOn: event.occurredOn.toISOString(),
                        payload: event,
                    }),
                    headers: {
                        'event-type': event.getEventName(),
                        'event-id': event.eventId,
                    },
                },
            ],
        });
    }

    async publishAll(events: DomainEvent[]): Promise<void> {
        if (events.length === 0) {
            return;
        }

        const messages = events.map((event) => ({
            key: event.getEventName(),
            value: JSON.stringify({
                eventId: event.eventId,
                eventName: event.getEventName(),
                occurredOn: event.occurredOn.toISOString(),
                payload: event,
            }),
            headers: {
                'event-type': event.getEventName(),
                'event-id': event.eventId,
            },
        }));

        await this.producer.send({
            topic: this.topic,
            messages,
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }
}
