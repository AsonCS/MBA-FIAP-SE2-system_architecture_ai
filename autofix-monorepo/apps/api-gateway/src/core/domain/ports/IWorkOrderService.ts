import {
    WorkOrderSummary,
    WorkOrder,
    CreateWorkOrderDto,
    WorkOrderFilters,
    UpdateWorkOrderStatusDto,
    WorkOrderItem,
} from '../types/work-order.types';

/**
 * Port (Interface) for Work Order Service
 * This defines the contract that any adapter must implement
 */
export abstract class IWorkOrderService {
    abstract getRecentOrders(
        tenantId: string,
        limit: number,
    ): Promise<WorkOrderSummary[]>;

    abstract createWorkOrder(
        tenantId: string,
        data: CreateWorkOrderDto,
    ): Promise<WorkOrder>;

    abstract updateStatus(
        tenantId: string,
        id: string,
        data: UpdateWorkOrderStatusDto,
    ): Promise<WorkOrder>;

    abstract listWorkOrders(
        tenantId: string,
        filters: WorkOrderFilters,
    ): Promise<WorkOrder[]>;

    abstract getWorkOrderById(tenantId: string, id: string): Promise<WorkOrder>;

    abstract addItemToWorkOrder(
        tenantId: string,
        workOrderId: string,
        item: WorkOrderItem,
    ): Promise<WorkOrder>;
}
