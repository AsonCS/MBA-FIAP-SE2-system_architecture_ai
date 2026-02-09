import { Injectable, Inject } from '@nestjs/common';
import { Producer, Kafka } from 'kafkajs';
import { IEventPublisher } from '@core/ports/event-publisher.port';
import { DomainEvent } from '@core/domain/events/domain-events';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
    private producer: Producer;

    constructor(
        @Inject('KAFKA_CLIENT')
        private readonly kafka: Kafka,
    ) {
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async publish(event: DomainEvent): Promise<void> {
        const topic = this.getTopicName(event);
        await this.producer.send({
            topic,
            messages: [
                {
                    key: event.getAggregateId(),
                    value: JSON.stringify(event),
                },
            ],
        });
    }

    async publishMany(events: DomainEvent[]): Promise<void> {
        const promises = events.map(event => this.publish(event));
        await Promise.all(promises);
    }

    private getTopicName(event: DomainEvent): string {
        const eventName = event.constructor.name;
        // Convert from PascalCase to kebab-case
        return eventName
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .substring(1);
    }
}
