import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../../domain/ports/IWorkOrderService';
import {
    CreateWorkOrderDto,
    WorkOrder,
} from '../../domain/types/work-order.types';

@Injectable()
export class CreateWorkOrder {
    constructor(private readonly workOrderService: IWorkOrderService) { }

    async execute(
        tenantId: string,
        data: CreateWorkOrderDto,
    ): Promise<WorkOrder> {
        return this.workOrderService.createWorkOrder(tenantId, data);
    }
}
