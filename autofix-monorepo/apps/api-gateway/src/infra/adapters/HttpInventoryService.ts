import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, catchError } from 'rxjs';
import { IInventoryService } from '../../core/domain/ports/IInventoryService';
import {
    Product,
    ProductFilters,
    CreateMovementDto,
    StockMovement,
} from '../../core/domain/types/inventory.types';

@Injectable()
export class HttpInventoryService implements IInventoryService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('SVC_INVENTORY_URL') || 'http://localhost:3004';
    }

    async getProducts(
        tenantId: string,
        filters: ProductFilters,
    ): Promise<Product[]> {
        try {
            const url = `${this.baseUrl}/products`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        params: filters,
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Inventory Service unavailable',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching products',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getProductById(tenantId: string, id: string): Promise<Product> {
        try {
            const url = `${this.baseUrl}/products/${id}`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Product not found',
                                error.response?.status || HttpStatus.NOT_FOUND,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching product',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async registerMovement(
        tenantId: string,
        movement: CreateMovementDto,
    ): Promise<StockMovement> {
        try {
            const url = `${this.baseUrl}/movements`;
            const { data } = await lastValueFrom(
                this.httpService
                    .post(url, movement, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to register movement',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error registering stock movement',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getLowStockProducts(tenantId: string): Promise<Product[]> {
        try {
            const url = `${this.baseUrl}/products/low-stock`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to fetch low stock products',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching low stock products',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getProductMovements(
        tenantId: string,
        productId: string,
    ): Promise<StockMovement[]> {
        try {
            const url = `${this.baseUrl}/products/${productId}/movements`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to fetch movements',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching product movements',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
