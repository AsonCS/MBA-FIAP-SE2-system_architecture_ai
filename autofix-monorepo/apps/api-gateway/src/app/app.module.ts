import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Controllers
import { DashboardController } from '../interfaces/rest/dashboard.controller';
import { WorkOrderController } from '../interfaces/rest/work-order.controller';
import { CustomerController } from '../interfaces/rest/customer.controller';
import { InventoryController } from '../interfaces/rest/inventory.controller';

// Use Cases
import { GetDashboardOverview } from '../core/use-cases/dashboard/GetDashboardOverview';
import { CreateWorkOrder } from '../core/use-cases/work-order/CreateWorkOrder';
import { ListWorkOrders } from '../core/use-cases/work-order/ListWorkOrders';
import { UpdateWorkOrderStatus } from '../core/use-cases/work-order/UpdateWorkOrderStatus';
import { CreateCustomer } from '../core/use-cases/customer/CreateCustomer';
import { AddVehicleToCustomer } from '../core/use-cases/customer/AddVehicleToCustomer';
import { GetProducts } from '../core/use-cases/inventory/GetProducts';

// Ports (Interfaces)
import { IWorkOrderService } from '../core/domain/ports/IWorkOrderService';
import { ICustomerService } from '../core/domain/ports/ICustomerService';
import { IInventoryService } from '../core/domain/ports/IInventoryService';

// Adapters (Implementations)
import { HttpWorkOrderService } from '../infra/adapters/HttpWorkOrderService';
import { HttpCustomerService } from '../infra/adapters/HttpCustomerService';
import { HttpInventoryService } from '../infra/adapters/HttpInventoryService';

@Module({
    imports: [
        // Global configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // HTTP module with retry configuration
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [
        DashboardController,
        WorkOrderController,
        CustomerController,
        InventoryController,
    ],
    providers: [
        // Use Cases
        GetDashboardOverview,
        CreateWorkOrder,
        ListWorkOrders,
        UpdateWorkOrderStatus,
        CreateCustomer,
        AddVehicleToCustomer,
        GetProducts,

        // Dependency Injection: Bind Ports to Adapters
        {
            provide: IWorkOrderService,
            useClass: HttpWorkOrderService,
        },
        {
            provide: ICustomerService,
            useClass: HttpCustomerService,
        },
        {
            provide: IInventoryService,
            useClass: HttpInventoryService,
        },
    ],
})
export class AppModule { }
