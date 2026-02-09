/**
 * CPF Value Object
 * Handles CPF validation and formatting
 */

export class CPF {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    /**
     * Create CPF from string (with or without formatting)
     */
    static create(value: string): CPF {
        const cleaned = CPF.clean(value);

        if (!CPF.isValid(cleaned)) {
            throw new Error(`Invalid CPF: ${value}`);
        }

        return new CPF(cleaned);
    }

    /**
     * Remove all non-numeric characters
     */
    private static clean(value: string): string {
        return value.replace(/\D/g, '');
    }

    /**
     * Validate CPF using the official algorithm
     */
    static isValid(cpf: string): boolean {
        const cleaned = CPF.clean(cpf);

        // Check length
        if (cleaned.length !== 11) {
            return false;
        }

        // Check for known invalid CPFs (all same digits)
        if (/^(\d)\1{10}$/.test(cleaned)) {
            return false;
        }

        // Validate check digits
        let sum = 0;
        let remainder: number;

        // First check digit
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cleaned.substring(9, 10))) {
            return false;
        }

        // Second check digit
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cleaned.substring(10, 11))) {
            return false;
        }

        return true;
    }

    /**
     * Get raw CPF value (numbers only)
     */
    get value(): string {
        return this._value;
    }

    /**
     * Get formatted CPF (XXX.XXX.XXX-XX)
     */
    get formatted(): string {
        return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    /**
     * Check equality
     */
    equals(other: CPF): boolean {
        return this._value === other._value;
    }

    /**
     * Convert to JSON
     */
    toJSON(): { value: string; formatted: string } {
        return {
            value: this._value,
            formatted: this.formatted,
        };
    }

    /**
     * String representation
     */
    toString(): string {
        return this.formatted;
    }
}
