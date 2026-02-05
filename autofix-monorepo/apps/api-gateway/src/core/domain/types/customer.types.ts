// Domain types for Customers and Vehicles
export interface Customer {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vehicle {
    id: string;
    customerId: string;
    plate: string;
    model: string;
    brand: string;
    year: number;
    chassis?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerDto {
    name: string;
    email: string;
    phone: string;
    document: string;
}

export interface CreateVehicleDto {
    plate: string;
    model: string;
    brand: string;
    year: number;
    chassis?: string;
    color?: string;
}

export interface PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
