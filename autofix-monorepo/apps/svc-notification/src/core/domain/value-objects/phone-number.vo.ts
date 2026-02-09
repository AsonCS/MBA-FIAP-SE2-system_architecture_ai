export class PhoneNumber {
    private readonly value: string;

    constructor(phone: string) {
        const normalized = this.normalizeToE164(phone);
        if (!this.isValid(normalized)) {
            throw new Error(`Invalid phone number: ${phone}`);
        }
        this.value = normalized;
    }

    private normalizeToE164(phone: string): string {
        // Remove all non-digit characters
        let digits = phone.replace(/\D/g, '');

        // If it doesn't start with +, add it
        if (!phone.startsWith('+')) {
            // Assume Brazil (+55) if no country code
            if (digits.length === 11 || digits.length === 10) {
                digits = '55' + digits;
            }
        }

        return '+' + digits;
    }

    private isValid(phone: string): boolean {
        // E.164 format: +[country code][number] (max 15 digits)
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        return e164Regex.test(phone);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: PhoneNumber): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
