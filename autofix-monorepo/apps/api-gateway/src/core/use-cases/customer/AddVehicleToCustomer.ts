import { Injectable } from '@nestjs/common';
import { ICustomerService } from '../../domain/ports/ICustomerService';
import {
    Vehicle,
    CreateVehicleDto,
} from '../../domain/types/customer.types';

@Injectable()
export class AddVehicleToCustomer {
    constructor(private readonly customerService: ICustomerService) { }

    async execute(
        tenantId: string,
        customerId: string,
        vehicle: CreateVehicleDto,
    ): Promise<Vehicle> {
        return this.customerService.addVehicle(tenantId, customerId, vehicle);
    }
}
