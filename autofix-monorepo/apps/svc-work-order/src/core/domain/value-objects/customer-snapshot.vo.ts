/**
 * CustomerSnapshot Value Object
 * Stores immutable customer data at the time of work order creation
 * Ensures historical accuracy even if customer data changes later
 */
export interface CustomerSnapshotProps {
    customerId: string;
    name: string;
    email?: string;
    phone?: string;
    document?: string; // CPF/CNPJ
}

export class CustomerSnapshot {
    private readonly _props: CustomerSnapshotProps;

    private constructor(props: CustomerSnapshotProps) {
        this.validate(props);
        this._props = Object.freeze({ ...props });
    }

    static create(props: CustomerSnapshotProps): CustomerSnapshot {
        return new CustomerSnapshot(props);
    }

    private validate(props: CustomerSnapshotProps): void {
        if (!props.customerId || props.customerId.trim() === '') {
            throw new Error('Customer ID is required');
        }
        if (!props.name || props.name.trim() === '') {
            throw new Error('Customer name is required');
        }
        if (props.email && !this.isValidEmail(props.email)) {
            throw new Error('Invalid email format');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get customerId(): string {
        return this._props.customerId;
    }

    get name(): string {
        return this._props.name;
    }

    get email(): string | undefined {
        return this._props.email;
    }

    get phone(): string | undefined {
        return this._props.phone;
    }

    get document(): string | undefined {
        return this._props.document;
    }

    toJSON(): CustomerSnapshotProps {
        return { ...this._props };
    }

    static fromJSON(data: CustomerSnapshotProps): CustomerSnapshot {
        return CustomerSnapshot.create(data);
    }
}
