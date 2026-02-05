import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, catchError } from 'rxjs';
import { ICustomerService } from '../../core/domain/ports/ICustomerService';
import {
    Customer,
    Vehicle,
    CreateCustomerDto,
    CreateVehicleDto,
    PaginationDto,
    PaginatedResponse,
} from '../../core/domain/types/customer.types';

@Injectable()
export class HttpCustomerService implements ICustomerService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('SVC_CUSTOMER_URL') || 'http://localhost:3003';
    }

    async listCustomers(
        tenantId: string,
        pagination: PaginationDto,
    ): Promise<PaginatedResponse<Customer>> {
        try {
            const url = `${this.baseUrl}/customers`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        params: pagination,
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Customer Service unavailable',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error listing customers',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async createCustomer(
        tenantId: string,
        customerData: CreateCustomerDto,
    ): Promise<Customer> {
        try {
            const url = `${this.baseUrl}/customers`;
            const { data } = await lastValueFrom(
                this.httpService
                    .post(url, customerData, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to create customer',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error creating customer',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getCustomerById(tenantId: string, id: string): Promise<Customer> {
        try {
            const url = `${this.baseUrl}/customers/${id}`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Customer not found',
                                error.response?.status || HttpStatus.NOT_FOUND,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching customer',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async addVehicle(
        tenantId: string,
        customerId: string,
        vehicle: CreateVehicleDto,
    ): Promise<Vehicle> {
        try {
            const url = `${this.baseUrl}/customers/${customerId}/vehicles`;
            const { data } = await lastValueFrom(
                this.httpService
                    .post(url, vehicle, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to add vehicle',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error adding vehicle',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getVehicleByPlate(tenantId: string, plate: string): Promise<Vehicle> {
        try {
            const url = `${this.baseUrl}/vehicles/${plate}`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Vehicle not found',
                                error.response?.status || HttpStatus.NOT_FOUND,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching vehicle',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async getCustomerVehicles(
        tenantId: string,
        customerId: string,
    ): Promise<Vehicle[]> {
        try {
            const url = `${this.baseUrl}/customers/${customerId}/vehicles`;
            const { data } = await lastValueFrom(
                this.httpService
                    .get(url, {
                        headers: { 'X-Tenant-ID': tenantId },
                    })
                    .pipe(
                        catchError((error) => {
                            throw new HttpException(
                                error.response?.data?.message || 'Failed to fetch vehicles',
                                error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
                            );
                        }),
                    ),
            );
            return data;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Error fetching customer vehicles',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
