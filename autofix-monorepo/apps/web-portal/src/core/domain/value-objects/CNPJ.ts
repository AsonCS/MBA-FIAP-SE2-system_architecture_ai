/**
 * CNPJ Value Object
 * Handles CNPJ validation and formatting
 */

export class CNPJ {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    /**
     * Create CNPJ from string (with or without formatting)
     */
    static create(value: string): CNPJ {
        const cleaned = CNPJ.clean(value);

        if (!CNPJ.isValid(cleaned)) {
            throw new Error(`Invalid CNPJ: ${value}`);
        }

        return new CNPJ(cleaned);
    }

    /**
     * Remove all non-numeric characters
     */
    private static clean(value: string): string {
        return value.replace(/\D/g, '');
    }

    /**
     * Validate CNPJ using the official algorithm
     */
    static isValid(cnpj: string): boolean {
        const cleaned = CNPJ.clean(cnpj);

        // Check length
        if (cleaned.length !== 14) {
            return false;
        }

        // Check for known invalid CNPJs (all same digits)
        if (/^(\d)\1{13}$/.test(cleaned)) {
            return false;
        }

        // Validate check digits
        let length = cleaned.length - 2;
        let numbers = cleaned.substring(0, length);
        const digits = cleaned.substring(length);
        let sum = 0;
        let pos = length - 7;

        // First check digit
        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) {
            return false;
        }

        // Second check digit
        length = length + 1;
        numbers = cleaned.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) {
            return false;
        }

        return true;
    }

    /**
     * Get raw CNPJ value (numbers only)
     */
    get value(): string {
        return this._value;
    }

    /**
     * Get formatted CNPJ (XX.XXX.XXX/XXXX-XX)
     */
    get formatted(): string {
        return this._value.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    }

    /**
     * Check equality
     */
    equals(other: CNPJ): boolean {
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
