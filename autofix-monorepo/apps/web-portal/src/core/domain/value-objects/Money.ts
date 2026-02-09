/**
 * Money Value Object
 * Handles monetary calculations with precision (using cents)
 * and provides formatting capabilities
 */

export class Money {
    private readonly _cents: number;

    private constructor(cents: number) {
        if (!Number.isInteger(cents)) {
            throw new Error('Money must be represented in whole cents');
        }
        if (cents < 0) {
            throw new Error('Money cannot be negative');
        }
        this._cents = cents;
    }

    /**
     * Create Money from cents
     */
    static fromCents(cents: number): Money {
        return new Money(cents);
    }

    /**
     * Create Money from decimal amount (e.g., 10.50)
     */
    static fromAmount(amount: number): Money {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
        const cents = Math.round(amount * 100);
        return new Money(cents);
    }

    /**
     * Create Money from string (e.g., "10.50" or "R$ 10,50")
     */
    static fromString(value: string): Money {
        // Remove currency symbols and normalize
        const normalized = value
            .replace(/[R$\s]/g, '')
            .replace(',', '.');

        const amount = parseFloat(normalized);
        if (isNaN(amount)) {
            throw new Error(`Invalid money string: ${value}`);
        }

        return Money.fromAmount(amount);
    }

    /**
     * Create zero money
     */
    static zero(): Money {
        return new Money(0);
    }

    /**
     * Get value in cents
     */
    get cents(): number {
        return this._cents;
    }

    /**
     * Get value as decimal amount
     */
    get amount(): number {
        return this._cents / 100;
    }

    /**
     * Add two Money values
     */
    add(other: Money): Money {
        return new Money(this._cents + other._cents);
    }

    /**
     * Subtract two Money values
     */
    subtract(other: Money): Money {
        const result = this._cents - other._cents;
        if (result < 0) {
            throw new Error('Subtraction would result in negative money');
        }
        return new Money(result);
    }

    /**
     * Multiply by a factor
     */
    multiply(factor: number): Money {
        if (factor < 0) {
            throw new Error('Cannot multiply by negative factor');
        }
        return new Money(Math.round(this._cents * factor));
    }

    /**
     * Divide by a divisor
     */
    divide(divisor: number): Money {
        if (divisor <= 0) {
            throw new Error('Cannot divide by zero or negative number');
        }
        return new Money(Math.round(this._cents / divisor));
    }

    /**
     * Check if greater than another Money value
     */
    greaterThan(other: Money): boolean {
        return this._cents > other._cents;
    }

    /**
     * Check if less than another Money value
     */
    lessThan(other: Money): boolean {
        return this._cents < other._cents;
    }

    /**
     * Check if equal to another Money value
     */
    equals(other: Money): boolean {
        return this._cents === other._cents;
    }

    /**
     * Check if zero
     */
    isZero(): boolean {
        return this._cents === 0;
    }

    /**
     * Format as Brazilian Real (BRL)
     */
    format(locale: string = 'pt-BR'): string {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'BRL',
        }).format(this.amount);
    }

    /**
     * Format without currency symbol
     */
    formatWithoutSymbol(locale: string = 'pt-BR'): string {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(this.amount);
    }

    /**
     * Convert to JSON
     */
    toJSON(): { cents: number; amount: number; formatted: string } {
        return {
            cents: this._cents,
            amount: this.amount,
            formatted: this.format(),
        };
    }

    /**
     * String representation
     */
    toString(): string {
        return this.format();
    }
}
