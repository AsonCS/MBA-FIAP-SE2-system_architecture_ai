/**
 * Money Value Object
 * Handles financial calculations using cents (integers) to avoid floating-point precision issues
 */
export class Money {
    private readonly _cents: number;

    private constructor(cents: number) {
        if (!Number.isInteger(cents)) {
            throw new Error('Money must be represented in cents (integer)');
        }
        if (cents < 0) {
            throw new Error('Money cannot be negative');
        }
        this._cents = cents;
    }

    static fromCents(cents: number): Money {
        return new Money(cents);
    }

    static fromUnits(units: number): Money {
        return new Money(Math.round(units * 100));
    }

    static zero(): Money {
        return new Money(0);
    }

    get cents(): number {
        return this._cents;
    }

    get units(): number {
        return this._cents / 100;
    }

    add(other: Money): Money {
        return new Money(this._cents + other._cents);
    }

    subtract(other: Money): Money {
        const result = this._cents - other._cents;
        if (result < 0) {
            throw new Error('Subtraction would result in negative money');
        }
        return new Money(result);
    }

    multiply(factor: number): Money {
        return new Money(Math.round(this._cents * factor));
    }

    divide(divisor: number): Money {
        if (divisor === 0) {
            throw new Error('Cannot divide by zero');
        }
        return new Money(Math.round(this._cents / divisor));
    }

    equals(other: Money): boolean {
        return this._cents === other._cents;
    }

    greaterThan(other: Money): boolean {
        return this._cents > other._cents;
    }

    lessThan(other: Money): boolean {
        return this._cents < other._cents;
    }

    toString(): string {
        return `${this.units.toFixed(2)}`;
    }

    toJSON(): number {
        return this._cents;
    }

    static fromJSON(cents: number): Money {
        return Money.fromCents(cents);
    }
}
