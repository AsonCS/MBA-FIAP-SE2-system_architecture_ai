import { Injectable } from '@nestjs/common';
import { IInventoryService } from '../../domain/ports/IInventoryService';
import { Product, ProductFilters } from '../../domain/types/inventory.types';

@Injectable()
export class GetProducts {
    constructor(private readonly inventoryService: IInventoryService) { }

    async execute(tenantId: string, filters: ProductFilters): Promise<Product[]> {
        return this.inventoryService.getProducts(tenantId, filters);
    }
}
