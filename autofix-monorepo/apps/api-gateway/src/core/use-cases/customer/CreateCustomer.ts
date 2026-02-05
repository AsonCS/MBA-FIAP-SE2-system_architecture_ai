import { Injectable } from '@nestjs/common';
import { ICustomerService } from '../../domain/ports/ICustomerService';
import {
    Customer,
    CreateCustomerDto,
} from '../../domain/types/customer.types';

@Injectable()
export class CreateCustomer {
    constructor(private readonly customerService: ICustomerService) { }

    async execute(
        tenantId: string,
        data: CreateCustomerDto,
    ): Promise<Customer> {
        return this.customerService.createCustomer(tenantId, data);
    }
}
