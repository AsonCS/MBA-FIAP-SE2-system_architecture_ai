/**
 * Common DTOs (Data Transfer Objects) for API communication
 */

/**
 * Paginated response
 */
export interface PaginatedResponseDTO<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}

/**
 * API Error Response
 */
export interface ApiErrorDTO {
    message: string;
    code: string;
    details?: Record<string, any>;
}

/**
 * Success Response
 */
export interface ApiSuccessDTO<T = any> {
    success: boolean;
    data: T;
    message?: string;
}
