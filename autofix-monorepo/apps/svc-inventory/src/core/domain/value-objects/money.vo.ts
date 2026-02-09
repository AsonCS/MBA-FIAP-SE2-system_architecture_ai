/**
 * Money Value Object
 * Handles monetary values with currency and precision
 */
export class Money {
    private readonly amount: number;
    private readonly currency: string;

    private constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    static create(amount: number, currency: string = 'BRL'): Money {
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }

        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency cannot be empty');
        }

        // Round to 2 decimal places for monetary precision
        const roundedAmount = Math.round(amount * 100) / 100;

        return new Money(roundedAmount, currency.toUpperCase());
    }

    static zero(currency: string = 'BRL'): Money {
        return new Money(0, currency);
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    add(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.amount + other.amount, this.currency);
    }

    subtract(other: Money): Money {
        this.ensureSameCurrency(other);
        const result = this.amount - other.amount;
        if (result < 0) {
            throw new Error('Resulting money amount cannot be negative');
        }
        return new Money(result, this.currency);
    }

    multiply(factor: number): Money {
        if (factor < 0) {
            throw new Error('Multiplication factor cannot be negative');
        }
        return new Money(this.amount * factor, this.currency);
    }

    divide(divisor: number): Money {
        if (divisor <= 0) {
            throw new Error('Division by zero or negative number is not allowed');
        }
        return new Money(this.amount / divisor, this.currency);
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }

    isGreaterThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount > other.amount;
    }

    private ensureSameCurrency(other: Money): void {
        if (this.currency !== other.currency) {
            throw new Error(
                `Currency mismatch: ${this.currency} vs ${other.currency}`,
            );
        }
    }

    toString(): string {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }
}
