// Domain types for Work Orders
export interface WorkOrderSummary {
    id: string;
    status: string;
    vehiclePlate: string;
    customerName: string;
    totalAmount?: number;
    createdAt: Date;
}

export interface WorkOrder {
    id: string;
    tenantId: string;
    customerId: string;
    vehicleId: string;
    status: WorkOrderStatus;
    description: string;
    items: WorkOrderItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum WorkOrderStatus {
    OPEN = 'OPEN',
    IN_ANALYSIS = 'IN_ANALYSIS',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    IN_EXECUTION = 'IN_EXECUTION',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface WorkOrderItem {
    id: string;
    type: 'SERVICE' | 'PART';
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CreateWorkOrderDto {
    customerId: string;
    vehicleId: string;
    description: string;
    items?: WorkOrderItem[];
}

export interface WorkOrderFilters {
    status?: WorkOrderStatus;
    mechanicId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}

export interface UpdateWorkOrderStatusDto {
    status: WorkOrderStatus;
    notes?: string;
}
