/**
 * SKU Value Object
 * Unique business identifier for products (e.g., OIL-FIL-001)
 */
export class SKU {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): SKU {
        if (!value || value.trim().length === 0) {
            throw new Error('SKU cannot be empty');
        }

        // Validate SKU format (e.g., XXX-XXX-NNN)
        const skuPattern = /^[A-Z]{3}-[A-Z]{3}-\d{3}$/;
        if (!skuPattern.test(value)) {
            throw new Error(
                'Invalid SKU format. Expected format: XXX-XXX-NNN (e.g., OIL-FIL-001)',
            );
        }

        return new SKU(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: SKU): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
