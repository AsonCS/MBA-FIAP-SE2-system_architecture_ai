/**
 * ICacheService Port
 * Interface for caching product projections
 */
export interface ICacheService {
    /**
     * Get cached value
     */
    get<T>(key: string): Promise<T | null>;

    /**
     * Set cached value with optional TTL
     */
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

    /**
     * Delete cached value
     */
    delete(key: string): Promise<void>;

    /**
     * Delete multiple cached values by pattern
     */
    deletePattern(pattern: string): Promise<void>;

    /**
     * Check if key exists
     */
    exists(key: string): Promise<boolean>;
}
