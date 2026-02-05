import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../../domain/ports/IWorkOrderService';
import {
    WorkOrder,
    WorkOrderFilters,
} from '../../domain/types/work-order.types';

@Injectable()
export class ListWorkOrders {
    constructor(private readonly workOrderService: IWorkOrderService) { }

    async execute(
        tenantId: string,
        filters: WorkOrderFilters,
    ): Promise<WorkOrder[]> {
        return this.workOrderService.listWorkOrders(tenantId, filters);
    }
}
