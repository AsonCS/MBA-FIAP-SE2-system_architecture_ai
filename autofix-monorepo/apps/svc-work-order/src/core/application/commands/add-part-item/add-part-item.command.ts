import { Money } from '../../../domain/value-objects';
import { PartItem } from '../../../domain/entities';
import { WorkOrderNotFoundException, InsufficientStockException } from '../../../domain/exceptions';
import { IWorkOrderRepository, IInventoryGateway, IOutboxRepository, OutboxMessage } from '../../../ports';
import { AddPartItemDto, WorkOrderResponseDto } from '../../dtos';

/**
 * AddPartItemCommand
 * Adds a part item to a work order with synchronous stock validation
 */
export class AddPartItemCommand {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
        private readonly inventoryGateway: IInventoryGateway,
        private readonly outboxRepository: IOutboxRepository,
    ) { }

    async execute(dto: AddPartItemDto): Promise<WorkOrderResponseDto> {
        // Find work order
        const workOrder = await this.workOrderRepository.findById(
            dto.workOrderId,
            dto.tenantId,
        );

        if (!workOrder) {
            throw new WorkOrderNotFoundException(dto.workOrderId);
        }

        // Synchronously check stock availability
        const isAvailable = await this.inventoryGateway.checkAvailability(
            dto.sku,
            dto.quantity,
            dto.tenantId,
        );

        if (!isAvailable) {
            const stockLevel = await this.inventoryGateway.getStockLevel(
                dto.sku,
                dto.tenantId,
            );
            throw new InsufficientStockException(dto.sku, dto.quantity, stockLevel);
        }

        // Create part item
        const partItem = PartItem.create({
            id: this.generateId(),
            sku: dto.sku,
            partName: dto.partName,
            manufacturer: dto.manufacturer,
            description: dto.description,
            quantity: dto.quantity,
            unitPrice: Money.fromCents(dto.unitPriceCents),
            discount: dto.discountCents ? Money.fromCents(dto.discountCents) : undefined,
        });

        // Add item to work order (automatically recalculates totals)
        workOrder.addItem(partItem);

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
