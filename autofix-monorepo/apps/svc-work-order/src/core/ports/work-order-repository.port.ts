import { WorkOrder } from '../domain/aggregates';

/**
 * IWorkOrderRepository Port
 * Defines the contract for work order persistence
 */
export interface IWorkOrderRepository {
    /**
     * Saves a work order (create or update)
     */
    save(workOrder: WorkOrder): Promise<void>;

    /**
     * Finds a work order by ID
     */
    findById(id: string, tenantId: string): Promise<WorkOrder | null>;

    /**
     * Finds a work order by order number
     */
    findByOrderNumber(orderNumber: string, tenantId: string): Promise<WorkOrder | null>;

    /**
     * Finds all work orders for a tenant
     */
    findAll(tenantId: string, options?: FindAllOptions): Promise<WorkOrder[]>;

    /**
     * Finds work orders by customer ID
     */
    findByCustomerId(customerId: string, tenantId: string): Promise<WorkOrder[]>;

    /**
     * Finds work orders by vehicle ID
     */
    findByVehicleId(vehicleId: string, tenantId: string): Promise<WorkOrder[]>;

    /**
     * Finds work orders by status
     */
    findByStatus(status: string, tenantId: string): Promise<WorkOrder[]>;

    /**
     * Deletes a work order (soft delete recommended)
     */
    delete(id: string, tenantId: string): Promise<void>;

    /**
     * Counts work orders for a tenant
     */
    count(tenantId: string, filters?: CountFilters): Promise<number>;
}

export interface FindAllOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    status?: string;
    customerId?: string;
    vehicleId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface CountFilters {
    status?: string;
    customerId?: string;
    vehicleId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}
