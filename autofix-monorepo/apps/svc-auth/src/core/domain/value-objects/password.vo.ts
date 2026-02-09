export class InvalidPasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidPasswordError';
    }
}

export class Password {
    private readonly hashedValue: string;

    private constructor(hashedValue: string) {
        this.hashedValue = hashedValue;
    }

    /**
     * Creates a Password from an already hashed value (e.g., from database)
     */
    static fromHash(hashedValue: string): Password {
        if (!hashedValue || hashedValue.trim().length === 0) {
            throw new InvalidPasswordError('Hashed password cannot be empty');
        }
        return new Password(hashedValue);
    }

    /**
     * Creates a Password from plain text (will be hashed by infrastructure layer)
     * This method is used during password creation/change
     */
    static fromPlainText(plainText: string): { plainText: string } {
        if (!plainText || plainText.length < 8) {
            throw new InvalidPasswordError('Password must be at least 8 characters long');
        }

        // Return plain text for hashing by infrastructure layer
        return { plainText };
    }

    getHashedValue(): string {
        return this.hashedValue;
    }

    /**
     * Compare method signature - actual comparison delegated to IHasher
     */
    async compare(plainText: string, hasher: { compare(plain: string, hash: string): Promise<boolean> }): Promise<boolean> {
        return hasher.compare(plainText, this.hashedValue);
    }
}
