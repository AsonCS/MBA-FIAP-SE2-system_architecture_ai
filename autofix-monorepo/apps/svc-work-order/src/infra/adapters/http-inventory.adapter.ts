import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
    IInventoryGateway,
    PartInfo,
    AvailabilityCheckResult,
} from '../../../core/ports';

/**
 * HttpInventoryAdapter
 * Anti-Corruption Layer for svc-inventory integration via HTTP
 */
@Injectable()
export class HttpInventoryAdapter implements IInventoryGateway {
    private readonly inventoryServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.inventoryServiceUrl =
            this.configService.get<string>('INVENTORY_SERVICE_URL') ||
            'http://localhost:3002';
    }

    async checkAvailability(
        sku: string,
        quantity: number,
        tenantId: string,
    ): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.inventoryServiceUrl}/api/inventory/check-availability`,
                    {
                        params: { sku, quantity, tenantId },
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );

            return response.data.available === true;
        } catch (error) {
            console.error('Error checking availability:', error);
            throw new HttpException(
                'Failed to check inventory availability',
                500,
            );
        }
    }

    async getStockLevel(sku: string, tenantId: string): Promise<number> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.inventoryServiceUrl}/api/inventory/stock-level/${sku}`,
                    {
                        params: { tenantId },
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );

            return response.data.stockLevel || 0;
        } catch (error) {
            console.error('Error getting stock level:', error);
            return 0;
        }
    }

    async reserveStock(
        sku: string,
        quantity: number,
        workOrderId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(
                    `${this.inventoryServiceUrl}/api/inventory/reserve`,
                    {
                        sku,
                        quantity,
                        workOrderId,
                        tenantId,
                    },
                    {
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );
        } catch (error) {
            console.error('Error reserving stock:', error);
            throw new HttpException('Failed to reserve stock', 500);
        }
    }

    async releaseReservation(
        workOrderId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(
                    `${this.inventoryServiceUrl}/api/inventory/release-reservation`,
                    {
                        workOrderId,
                        tenantId,
                    },
                    {
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );
        } catch (error) {
            console.error('Error releasing reservation:', error);
            // Don't throw - this is a cleanup operation
        }
    }

    async getPartInfo(sku: string, tenantId: string): Promise<PartInfo | null> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.inventoryServiceUrl}/api/inventory/parts/${sku}`,
                    {
                        params: { tenantId },
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );

            const data = response.data;
            return {
                sku: data.sku,
                name: data.name,
                description: data.description,
                unitPrice: data.unitPrice,
                manufacturer: data.manufacturer,
                stockLevel: data.stockLevel,
            };
        } catch (error) {
            console.error('Error getting part info:', error);
            return null;
        }
    }

    async checkMultipleAvailability(
        items: Array<{ sku: string; quantity: number }>,
        tenantId: string,
    ): Promise<AvailabilityCheckResult[]> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.inventoryServiceUrl}/api/inventory/check-multiple`,
                    {
                        items,
                        tenantId,
                    },
                    {
                        headers: { 'X-Tenant-ID': tenantId },
                    },
                ),
            );

            return response.data.results || [];
        } catch (error) {
            console.error('Error checking multiple availability:', error);
            // Return all as unavailable on error
            return items.map((item) => ({
                sku: item.sku,
                requested: item.quantity,
                available: 0,
                isAvailable: false,
            }));
        }
    }
}
