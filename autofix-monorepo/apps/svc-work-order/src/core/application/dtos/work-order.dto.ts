/**
 * DTOs for Work Order Use Cases
 */

// Create Work Order
export interface CreateWorkOrderDto {
    tenantId: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    customerDocument?: string;
    vehicleId: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    color?: string;
    mileage?: number;
    notes?: string;
}

// Add Part Item
export interface AddPartItemDto {
    workOrderId: string;
    tenantId: string;
    sku: string;
    partName: string;
    manufacturer?: string;
    description: string;
    quantity: number;
    unitPriceCents: number;
    discountCents?: number;
}

// Add Service Item
export interface AddServiceItemDto {
    workOrderId: string;
    tenantId: string;
    serviceCode: string;
    serviceName: string;
    description: string;
    quantity: number;
    unitPriceCents: number;
    discountCents?: number;
    estimatedHours?: number;
    technicianId?: string;
}

// Remove Item
export interface RemoveItemDto {
    workOrderId: string;
    itemId: string;
    tenantId: string;
}

// Update Work Order Status
export interface UpdateWorkOrderStatusDto {
    workOrderId: string;
    tenantId: string;
    newStatus: string;
}

// Update Notes
export interface UpdateNotesDto {
    workOrderId: string;
    tenantId: string;
    notes: string;
}

// Get Work Order
export interface GetWorkOrderDto {
    workOrderId: string;
    tenantId: string;
}

// List Work Orders
export interface ListWorkOrdersDto {
    tenantId: string;
    limit?: number;
    offset?: number;
    status?: string;
    customerId?: string;
    vehicleId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

// Work Order Response
export interface WorkOrderResponseDto {
    id: string;
    tenantId: string;
    orderNumber: string;
    customer: {
        customerId: string;
        name: string;
        email?: string;
        phone?: string;
        document?: string;
    };
    vehicle: {
        vehicleId: string;
        licensePlate: string;
        make: string;
        model: string;
        year: number;
        vin?: string;
        color?: string;
        mileage?: number;
    };
    status: string;
    items: Array<{
        id: string;
        type: 'PART' | 'SERVICE';
        description: string;
        quantity: number;
        unitPriceCents: number;
        discountCents: number;
        subtotalCents: number;
        // Part-specific fields
        sku?: string;
        partName?: string;
        manufacturer?: string;
        // Service-specific fields
        serviceCode?: string;
        serviceName?: string;
        estimatedHours?: number;
        technicianId?: string;
    }>;
    notes?: string;
    totalPartsCents: number;
    totalLaborCents: number;
    totalAmountCents: number;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}
