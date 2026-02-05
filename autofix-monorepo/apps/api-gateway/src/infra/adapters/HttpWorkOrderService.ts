import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, catchError } from 'rxjs';
import { IWorkOrderService } from '../../core/domain/ports/IWorkOrderService';
import {
    WorkOrderSummary,
    WorkOrder,
    CreateWorkOrderDto,
    WorkOrderFilters,
    UpdateWorkOrderStatusDto,
    WorkOrderItem,
} from '../../core/domain/types/work-order.types';

@Injectable()
export class HttpWorkOrderService implements IWorkOrderService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('SVC_WORK_ORDER_URL') || 'http://localhost:3002';
    }

    async getRecentOrders(
        tenantId: string,
        limit: number,
    ): Promise<WorkOrderSummary[]> {
        try {
            const url = `${this.baseUrl}/orders/recent`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        params: { limit },
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Work Order Service unavailable',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error communicating with Work Order Service',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async createWorkOrder(
        tenantId: string,
        workOrderData: CreateWorkOrderDto,
    ): Promise<WorkOrder> {
        try {
            const url = `${this.baseUrl}/orders`;
            const { data } = await lastValueFrom(
                this.httpService
                    .post(url, workOrderData, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to create work order',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error creating work order',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async updateStatus(
        tenantId: string,
        id: string,
        statusData: UpdateWorkOrderStatusDto,
    ): Promise<WorkOrder> {
        try {
            const url = `${this.baseUrl}/orders/${id}/status`;
            const { data } = await lastValueFrom(
                this.httpService
                    .patch(url, statusData, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to update status',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error updating work order status',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async listWorkOrders(
        tenantId: string,
        filters: WorkOrderFilters,
    ): Promise<WorkOrder[]> {
        try {
            const url = `${this.baseUrl}/orders`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        params: filters,
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to list work orders',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error listing work orders',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getWorkOrderById(tenantId: string, id: string): Promise<WorkOrder> {
        try {
            const url = `${this.baseUrl}/orders/${id}`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Work order not found',
                                error.response?.status || HttpStatus.NOT_FOUND,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching work order',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async addItemToWorkOrder(
        tenantId: string,
        workOrderId: string,
        item: WorkOrderItem,
    ): Promise<WorkOrder> {
        try {
            const url = `${this.baseUrl}/orders/${workOrderId}/items`;
            const { data } = await lastValueFrom(
                this.httpService
                    .post(url, item, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to add item',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error adding item to work order',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
