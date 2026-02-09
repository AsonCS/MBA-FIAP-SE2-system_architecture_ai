/**
 * Email Value Object
 * Handles email validation
 */

export class Email {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value.toLowerCase();
    }

    /**
     * Email validation regex (RFC 5322 simplified)
     */
    private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    /**
     * Create Email from string
     */
    static create(value: string): Email {
        const trimmed = value.trim();

        if (!Email.isValid(trimmed)) {
            throw new Error(`Invalid email: ${value}`);
        }

        return new Email(trimmed);
    }

    /**
     * Validate email format
     */
    static isValid(email: string): boolean {
        if (!email || email.length === 0) {
            return false;
        }

        if (email.length > 254) {
            return false;
        }

        return Email.EMAIL_REGEX.test(email);
    }

    /**
     * Get email value
     */
    get value(): string {
        return this._value;
    }

    /**
     * Get domain part of email
     */
    get domain(): string {
        return this._value.split('@')[1];
    }

    /**
     * Get local part of email
     */
    get localPart(): string {
        return this._value.split('@')[0];
    }

    /**
     * Check equality
     */
    equals(other: Email): boolean {
        return this._value === other._value;
    }

    /**
     * Convert to JSON
     */
    toJSON(): string {
        return this._value;
    }

    /**
     * String representation
     */
    toString(): string {
        return this._value;
    }
}
