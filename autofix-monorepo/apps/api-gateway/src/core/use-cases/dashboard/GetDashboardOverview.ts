import { Injectable } from '@nestjs/common';
import { IWorkOrderService } from '../../domain/ports/IWorkOrderService';
import { ICustomerService } from '../../domain/ports/ICustomerService';
import { IInventoryService } from '../../domain/ports/IInventoryService';
import { WorkOrderSummary } from '../../domain/types/work-order.types';
import { Product } from '../../domain/types/inventory.types';

export interface DashboardAggregate {
    recentOrders: WorkOrderSummary[];
    totalCustomers: number;
    lowStockAlerts: Product[];
    timestamp: Date;
}

@Injectable()
export class GetDashboardOverview {
    constructor(
        private readonly workOrderService: IWorkOrderService,
        private readonly customerService: ICustomerService,
        private readonly inventoryService: IInventoryService,
    ) { }

    async execute(tenantId: string): Promise<DashboardAggregate> {
        // Fetch data from multiple services in parallel
        const [recentOrders, customersResponse, lowStockProducts] =
            await Promise.all([
                this.workOrderService.getRecentOrders(tenantId, 5),
                this.customerService.listCustomers(tenantId, { page: 1, limit: 1 }),
                this.inventoryService.getLowStockProducts(tenantId),
            ]);

        return {
            recentOrders,
            totalCustomers: customersResponse.total,
            lowStockAlerts: lowStockProducts,
            timestamp: new Date(),
        };
    }
}
