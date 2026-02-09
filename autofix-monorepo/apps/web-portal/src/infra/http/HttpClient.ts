import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * HTTP Client Configuration
 */
export interface HttpClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}

/**
 * HTTP Client for API communication
 * Implements interceptors for authentication and error handling
 */
export class HttpClient {
    private axiosInstance: AxiosInstance;

    constructor(config: HttpClientConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor - Add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized - clear token and redirect to login
                    this.clearAuthToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(this.normalizeError(error));
            }
        );
    }

    /**
     * Get authentication token from storage
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem('auth_token');
    }

    /**
     * Clear authentication token
     */
    private clearAuthToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    /**
     * Normalize error response
     */
    private normalizeError(error: AxiosError): HttpError {
        return {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code,
        };
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
        return response.data;
    }

    /**
     * POST request
     */
    async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
        return response.data;
    }

    /**
     * PUT request
     */
    async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
        return response.data;
    }

    /**
     * PATCH request
     */
    async patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
        return response.data;
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
        return response.data;
    }

    /**
     * Get the underlying Axios instance
     */
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

/**
 * HTTP Error interface
 */
export interface HttpError {
    message: string;
    status?: number;
    data?: any;
    code?: string;
}

/**
 * Create default HTTP client instance
 */
export const createHttpClient = (config?: Partial<HttpClientConfig>): HttpClient => {
    const defaultConfig: HttpClientConfig = {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        timeout: 30000,
        ...config,
    };

    return new HttpClient(defaultConfig);
};
