import { Money } from '../../../domain/value-objects';
import { ServiceItem } from '../../../domain/entities';
import { WorkOrderNotFoundException } from '../../../domain/exceptions';
import { IWorkOrderRepository, IOutboxRepository, OutboxMessage } from '../../../ports';
import { AddServiceItemDto, WorkOrderResponseDto } from '../../dtos';

/**
 * AddServiceItemCommand
 * Adds a service/labor item to a work order
 */
export class AddServiceItemCommand {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
        private readonly outboxRepository: IOutboxRepository,
    ) { }

    async execute(dto: AddServiceItemDto): Promise<WorkOrderResponseDto> {
        // Find work order
        const workOrder = await this.workOrderRepository.findById(
            dto.workOrderId,
            dto.tenantId,
        );

        if (!workOrder) {
            throw new WorkOrderNotFoundException(dto.workOrderId);
        }

        // Create service item
        const serviceItem = ServiceItem.create({
            id: this.generateId(),
            serviceCode: dto.serviceCode,
            serviceName: dto.serviceName,
            description: dto.description,
            quantity: dto.quantity,
            unitPrice: Money.fromCents(dto.unitPriceCents),
            discount: dto.discountCents ? Money.fromCents(dto.discountCents) : undefined,
            estimatedHours: dto.estimatedHours,
            technicianId: dto.technicianId,
        });

        // Add item to work order (automatically recalculates totals)
        workOrder.addItem(serviceItem);

        // Save work order
        await this.workOrderRepository.save(workOrder);

        // Save domain events to outbox
        await this.saveEventsToOutbox(workOrder);

        // Clear domain events
        workOrder.clearDomainEvents();

        return this.toResponseDto(workOrder);
    }

    private generateId(): string {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
