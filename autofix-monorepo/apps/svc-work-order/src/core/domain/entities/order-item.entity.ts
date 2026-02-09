import { Money } from '../value-objects';

/**
 * OrderItem Base Entity
 * Abstract base class for items in a work order (parts or services)
 */
export enum OrderItemType {
    PART = 'PART',
    SERVICE = 'SERVICE',
}

export interface OrderItemProps {
    id: string;
    description: string;
    quantity: number;
    unitPrice: Money;
    discount?: Money;
}

export abstract class OrderItem {
    protected readonly _id: string;
    protected _description: string;
    protected _quantity: number;
    protected _unitPrice: Money;
    protected _discount: Money;

    protected constructor(props: OrderItemProps) {
        this.validate(props);
        this._id = props.id;
        this._description = props.description;
        this._quantity = props.quantity;
        this._unitPrice = props.unitPrice;
        this._discount = props.discount || Money.zero();
    }

    protected validate(props: OrderItemProps): void {
        if (!props.id || props.id.trim() === '') {
            throw new Error('Item ID is required');
        }
        if (!props.description || props.description.trim() === '') {
            throw new Error('Item description is required');
        }
        if (props.quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (!Number.isInteger(props.quantity)) {
            throw new Error('Quantity must be an integer');
        }
    }

    abstract get type(): OrderItemType;

    get id(): string {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    get quantity(): number {
        return this._quantity;
    }

    get unitPrice(): Money {
        return this._unitPrice;
    }

    get discount(): Money {
        return this._discount;
    }

    /**
     * Calculates the subtotal for this item
     * Formula: (unitPrice * quantity) - discount
     */
    get subtotal(): Money {
        const total = this._unitPrice.multiply(this._quantity);
        return total.subtract(this._discount);
    }

    updateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (!Number.isInteger(quantity)) {
            throw new Error('Quantity must be an integer');
        }
        this._quantity = quantity;
    }

    updateUnitPrice(unitPrice: Money): void {
        this._unitPrice = unitPrice;
    }

    applyDiscount(discount: Money): void {
        const maxDiscount = this._unitPrice.multiply(this._quantity);
        if (discount.greaterThan(maxDiscount)) {
            throw new Error('Discount cannot exceed total price');
        }
        this._discount = discount;
    }

    abstract toJSON(): any;
}
