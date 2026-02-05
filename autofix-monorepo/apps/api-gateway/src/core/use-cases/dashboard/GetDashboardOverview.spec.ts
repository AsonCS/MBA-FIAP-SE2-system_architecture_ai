import { GetDashboardOverview } from './GetDashboardOverview';
import { IWorkOrderService } from '../../domain/ports/IWorkOrderService';
import { ICustomerService } from '../../domain/ports/ICustomerService';
import { IInventoryService } from '../../domain/ports/IInventoryService';

describe('GetDashboardOverview', () => {
    let useCase: GetDashboardOverview;
    let workOrderService: IWorkOrderService;
    let customerService: ICustomerService;
    let inventoryService: IInventoryService;

    beforeEach(() => {
        // Mock the service interfaces
        workOrderService = {
            getRecentOrders: jest.fn().mockResolvedValue([
                { id: '1', status: 'OPEN', vehiclePlate: 'ABC-1234', customerName: 'John Doe' },
                { id: '2', status: 'IN_EXECUTION', vehiclePlate: 'XYZ-9876', customerName: 'Jane Smith' },
            ]),
        } as any;

        customerService = {
            listCustomers: jest.fn().mockResolvedValue({
                data: [],
                total: 42,
                page: 1,
                limit: 10,
                totalPages: 5,
            }),
        } as any;

        inventoryService = {
            getLowStockProducts: jest.fn().mockResolvedValue([
                { id: '1', name: 'Oil Filter', stockQuantity: 2, minStockLevel: 10 },
            ]),
        } as any;

        useCase = new GetDashboardOverview(
            workOrderService,
            customerService,
            inventoryService,
        );
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should return aggregated dashboard data', async () => {
        const result = await useCase.execute('tenant-1');

        expect(result).toBeDefined();
        expect(result.recentOrders).toHaveLength(2);
        expect(result.totalCustomers).toBe(42);
        expect(result.lowStockAlerts).toHaveLength(1);
        expect(result.timestamp).toBeDefined();
        expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should call workOrderService.getRecentOrders with correct parameters', async () => {
        await useCase.execute('tenant-1');

        expect(workOrderService.getRecentOrders).toHaveBeenCalledWith('tenant-1', 5);
    });

    it('should call customerService.listCustomers with correct parameters', async () => {
        await useCase.execute('tenant-1');

        expect(customerService.listCustomers).toHaveBeenCalledWith('tenant-1', {
            page: 1,
            limit: 1,
        });
    });

    it('should call inventoryService.getLowStockProducts with correct parameters', async () => {
        await useCase.execute('tenant-1');

        expect(inventoryService.getLowStockProducts).toHaveBeenCalledWith('tenant-1');
    });

    it('should handle errors gracefully', async () => {
        workOrderService.getRecentOrders = jest
            .fn()
            .mockRejectedValue(new Error('Service unavailable'));

        await expect(useCase.execute('tenant-1')).rejects.toThrow('Service unavailable');
    });
});
