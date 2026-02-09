import { WorkOrderNotFoundException } from '../../../domain/exceptions';
import { IWorkOrderRepository } from '../../../ports';
import { GetWorkOrderDto, WorkOrderResponseDto } from '../../dtos';

/**
 * GetWorkOrderQuery
 * Retrieves a single work order by ID
 */
export class GetWorkOrderQuery {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
    ) { }

    async execute(dto: GetWorkOrderDto): Promise<WorkOrderResponseDto> {
        const workOrder = await this.workOrderRepository.findById(
            dto.workOrderId,
            dto.tenantId,
        );

        if (!workOrder) {
            throw new WorkOrderNotFoundException(dto.workOrderId);
        }

        return this.toResponseDto(workOrder);
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
