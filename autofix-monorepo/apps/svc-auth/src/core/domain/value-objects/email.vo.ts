export class InvalidEmailError extends Error {
    constructor(email: string) {
        super(`Invalid email format: ${email}`);
        this.name = 'InvalidEmailError';
    }
}

export class Email {
    private readonly value: string;

    constructor(email: string) {
        const normalized = email.trim().toLowerCase();

        if (!this.isValid(normalized)) {
            throw new InvalidEmailError(email);
        }

        this.value = normalized;
    }

    private isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
