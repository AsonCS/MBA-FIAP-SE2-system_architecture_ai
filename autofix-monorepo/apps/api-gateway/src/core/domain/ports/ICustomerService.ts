import {
    Customer,
    Vehicle,
    CreateCustomerDto,
    CreateVehicleDto,
    PaginationDto,
    PaginatedResponse,
} from '../types/customer.types';

/**
 * Port (Interface) for Customer Service
 * This defines the contract that any adapter must implement
 */
export abstract class ICustomerService {
    abstract listCustomers(
        tenantId: string,
        pagination: PaginationDto,
    ): Promise<PaginatedResponse<Customer>>;

    abstract createCustomer(
        tenantId: string,
        data: CreateCustomerDto,
    ): Promise<Customer>;

    abstract getCustomerById(tenantId: string, id: string): Promise<Customer>;

    abstract addVehicle(
        tenantId: string,
        customerId: string,
        vehicle: CreateVehicleDto,
    ): Promise<Vehicle>;

    abstract getVehicleByPlate(tenantId: string, plate: string): Promise<Vehicle>;

    abstract getCustomerVehicles(
        tenantId: string,
        customerId: string,
    ): Promise<Vehicle[]>;
}
