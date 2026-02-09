/**
 * Quantity Value Object
 * Encapsulates arithmetic logic and validation (prevents negative values)
 */
export class Quantity {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): Quantity {
        if (value < 0) {
            throw new Error('Quantity cannot be negative');
        }

        if (!Number.isInteger(value)) {
            throw new Error('Quantity must be an integer');
        }

        return new Quantity(value);
    }

    static zero(): Quantity {
        return new Quantity(0);
    }

    getValue(): number {
        return this.value;
    }

    add(other: Quantity): Quantity {
        return new Quantity(this.value + other.value);
    }

    subtract(other: Quantity): Quantity {
        const result = this.value - other.value;
        if (result < 0) {
            throw new Error('Resulting quantity cannot be negative');
        }
        return new Quantity(result);
    }

    isGreaterThan(other: Quantity): boolean {
        return this.value > other.value;
    }

    isGreaterThanOrEqual(other: Quantity): boolean {
        return this.value >= other.value;
    }

    isLessThan(other: Quantity): boolean {
        return this.value < other.value;
    }

    equals(other: Quantity): boolean {
        return this.value === other.value;
    }

    isZero(): boolean {
        return this.value === 0;
    }

    toString(): string {
        return this.value.toString();
    }
}
