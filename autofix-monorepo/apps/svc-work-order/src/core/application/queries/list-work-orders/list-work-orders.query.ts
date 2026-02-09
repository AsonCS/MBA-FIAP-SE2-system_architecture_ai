import { IWorkOrderRepository } from '../../../ports';
import { ListWorkOrdersDto, WorkOrderResponseDto } from '../../dtos';

/**
 * ListWorkOrdersQuery
 * Retrieves a list of work orders with filtering and pagination
 */
export class ListWorkOrdersQuery {
    constructor(
        private readonly workOrderRepository: IWorkOrderRepository,
    ) { }

    async execute(dto: ListWorkOrdersDto): Promise<WorkOrderResponseDto[]> {
        const workOrders = await this.workOrderRepository.findAll(dto.tenantId, {
            limit: dto.limit,
            offset: dto.offset,
            status: dto.status,
            customerId: dto.customerId,
            vehicleId: dto.vehicleId,
            dateFrom: dto.dateFrom,
            dateTo: dto.dateTo,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
        });

        return workOrders.map((workOrder) => this.toResponseDto(workOrder));
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
