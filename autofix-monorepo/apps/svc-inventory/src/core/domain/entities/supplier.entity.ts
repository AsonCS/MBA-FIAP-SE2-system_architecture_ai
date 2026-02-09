/**
 * Supplier Entity
 * Represents a product supplier
 */
export interface SupplierProps {
    id: string;
    name: string;
    code: string;
    email?: string;
    phone?: string;
    active: boolean;
}

export class Supplier {
    private readonly props: SupplierProps;

    private constructor(props: SupplierProps) {
        this.props = { ...props };
    }

    static create(props: Omit<SupplierProps, 'id'>): Supplier {
        return new Supplier({
            ...props,
            id: this.generateId(),
        });
    }

    static reconstitute(props: SupplierProps): Supplier {
        return new Supplier(props);
    }

    private static generateId(): string {
        return `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getId(): string {
        return this.props.id;
    }

    getName(): string {
        return this.props.name;
    }

    getCode(): string {
        return this.props.code;
    }

    getEmail(): string | undefined {
        return this.props.email;
    }

    getPhone(): string | undefined {
        return this.props.phone;
    }

    isActive(): boolean {
        return this.props.active;
    }

    toJSON(): SupplierProps {
        return { ...this.props };
    }
}
