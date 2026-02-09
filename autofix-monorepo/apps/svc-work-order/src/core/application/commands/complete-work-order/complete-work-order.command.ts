import { WorkOrderNotFoundException } from '../../../domain/exceptions';
import { IWorkOrderRepository, IOutboxRepository, OutboxMessage } from '../../../ports';
import { UpdateWorkOrderStatusDto, WorkOrderResponseDto } from '../../dtos';
import { WorkOrderStatus } from '../../../domain/value-objects';

/**
 * CompleteWorkOrderCommand
 * Completes a work order and triggers inventory deduction via outbox
 */
export class CompleteWorkOrderCommand {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
        private readonly outboxRepository: IOutboxRepository,
    ) { }

    async execute(dto: UpdateWorkOrderStatusDto): Promise<WorkOrderResponseDto> {
        // Find work order
        const workOrder = await this.workOrderRepository.findById(
            dto.workOrderId,
            dto.tenantId,
        );

        if (!workOrder) {
            throw new WorkOrderNotFoundException(dto.workOrderId);
        }

        // Complete the work order (triggers domain event)
        workOrder.complete();

        // Save work order (within transaction)
        await this.workOrderRepository.save(workOrder);

        // Save domain events to outbox (within same transaction)
        await this.saveEventsToOutbox(workOrder);

        // Clear domain events
        workOrder.clearDomainEvents();

        return this.toResponseDto(workOrder);
    }

    private generateId(): string {
        return `outbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async saveEventsToOutbox(workOrder: any): Promise<void> {
        const events = workOrder.domainEvents;

        for (const event of events) {
            const outboxMessage: OutboxMessage = {
                id: this.generateId(),
                eventId: event.eventId,
                eventName: event.eventName,
                payload: event.toJSON(),
                tenantId: workOrder.tenantId,
                createdAt: new Date(),
                status: 'PENDING',
                retryCount: 0,
            };

            await this.outboxRepository.save(outboxMessage);
        }
    }

    private toResponseDto(workOrder: any): WorkOrderResponseDto {
        const json = workOrder.toJSON();

        return {
            id: json.id,
            tenantId: json.tenantId,
            orderNumber: json.orderNumber,
            customer: json.customer,
            vehicle: json.vehicle,
            status: json.status,
            items: json.items,
            notes: json.notes,
            totalPartsCents: json.totalParts,
            totalLaborCents: json.totalLabor,
            totalAmountCents: json.totalAmount,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt,
            completedAt: json.completedAt,
        };
    }
}
