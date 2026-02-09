export class InvalidCPFError extends Error {
    constructor(cpf: string) {
        super(`Invalid CPF: ${cpf}`);
        this.name = 'InvalidCPFError';
    }
}

export class CPF {
    private readonly value: string;

    constructor(cpf: string) {
        const cleaned = cpf.replace(/\D/g, '');

        if (!this.isValid(cleaned)) {
            throw new InvalidCPFError(cpf);
        }

        this.value = cleaned;
    }

    private isValid(cpf: string): boolean {
        if (cpf.length !== 11) return false;

        // Check if all digits are the same
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validate first check digit
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let checkDigit = 11 - (sum % 11);
        if (checkDigit >= 10) checkDigit = 0;
        if (checkDigit !== parseInt(cpf.charAt(9))) return false;

        // Validate second check digit
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        checkDigit = 11 - (sum % 11);
        if (checkDigit >= 10) checkDigit = 0;
        if (checkDigit !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    getValue(): string {
        return this.value;
    }

    getFormatted(): string {
        return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    equals(other: CPF): boolean {
        return this.value === other.value;
    }
}
