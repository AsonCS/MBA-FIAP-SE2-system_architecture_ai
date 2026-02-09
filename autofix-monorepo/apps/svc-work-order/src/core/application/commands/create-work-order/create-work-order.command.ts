import { WorkOrder } from '../../../domain/aggregates';
import { CustomerSnapshot, VehicleSnapshot } from '../../../domain/value-objects';
import { IWorkOrderRepository, IOutboxRepository, OutboxMessage } from '../../../ports';
import { CreateWorkOrderDto, WorkOrderResponseDto } from '../../dtos';

/**
 * CreateWorkOrderCommand
 * Creates a new work order in DRAFT status
 */
export class CreateWorkOrderCommand {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
        private readonly outboxRepository: IOutboxRepository,
    ) { }

    async execute(dto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
        // Generate unique ID and order number
        const workOrderId = this.generateId();
        const orderNumber = await this.generateOrderNumber(dto.tenantId);

        // Create customer snapshot
        const customerSnapshot = CustomerSnapshot.create({
            customerId: dto.customerId,
            name: dto.customerName,
            email: dto.customerEmail,
            phone: dto.customerPhone,
            document: dto.customerDocument,
        });

        // Create vehicle snapshot
        const vehicleSnapshot = VehicleSnapshot.create({
            vehicleId: dto.vehicleId,
            licensePlate: dto.licensePlate,
            make: dto.make,
            model: dto.model,
            year: dto.year,
            vin: dto.vin,
            color: dto.color,
            mileage: dto.mileage,
        });

        // Create work order aggregate
        const workOrder = WorkOrder.create(
            workOrderId,
            dto.tenantId,
            orderNumber,
            customerSnapshot,
            vehicleSnapshot,
            dto.notes,
        );

        // Save work order
        await this.workOrderRepository.save(workOrder);

        // Save domain events to outbox
        await this.saveEventsToOutbox(workOrder);

        // Clear domain events
        workOrder.clearDomainEvents();

        return this.toResponseDto(workOrder);
    }

    private generateId(): string {
        return `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async generateOrderNumber(tenantId: string): Promise<string> {
        const count = await this.workOrderRepository.count(tenantId);
        const year = new Date().getFullYear();
        const sequence = (count + 1).toString().padStart(6, '0');
        return `WO-${year}-${sequence}`;
    }

    private async saveEventsToOutbox(workOrder: WorkOrder): Promise<void> {
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

    private toResponseDto(workOrder: WorkOrder): WorkOrderResponseDto {
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
