import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../../domain/ports/IWorkOrderService';
import {
    WorkOrder,
    UpdateWorkOrderStatusDto,
} from '../../domain/types/work-order.types';

@Injectable()
export class UpdateWorkOrderStatus {
    constructor(private readonly workOrderService: IWorkOrderService) { }

    async execute(
        tenantId: string,
        id: string,
        data: UpdateWorkOrderStatusDto,
    ): Promise<WorkOrder> {
        return this.workOrderService.updateStatus(tenantId, id, data);
    }
}
