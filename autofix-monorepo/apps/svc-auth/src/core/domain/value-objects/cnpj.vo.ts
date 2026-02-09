export class InvalidCNPJError extends Error {
    constructor(cnpj: string) {
        super(`Invalid CNPJ: ${cnpj}`);
        this.name = 'InvalidCNPJError';
    }
}

export class CNPJ {
    private readonly value: string;

    constructor(cnpj: string) {
        const cleaned = cnpj.replace(/\D/g, '');

        if (!this.isValid(cleaned)) {
            throw new InvalidCNPJError(cnpj);
        }

        this.value = cleaned;
    }

    private isValid(cnpj: string): boolean {
        if (cnpj.length !== 14) return false;

        // Check if all digits are the same
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        // Validate first check digit
        let length = cnpj.length - 2;
        let numbers = cnpj.substring(0, length);
        const digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        // Validate second check digit
        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }

    getValue(): string {
        return this.value;
    }

    getFormatted(): string {
        return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    equals(other: CNPJ): boolean {
        return this.value === other.value;
    }
}
