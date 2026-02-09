import { Money } from '../value-objects';
import { OrderItem, OrderItemProps, OrderItemType } from './order-item.entity';

/**
 * PartItem Entity
 * Represents a physical part/product in a work order
 */
export interface PartItemProps extends OrderItemProps {
    sku: string;
    partName: string;
    manufacturer?: string;
}

export class PartItem extends OrderItem {
    private readonly _sku: string;
    private readonly _partName: string;
    private readonly _manufacturer?: string;

    private constructor(props: PartItemProps) {
        super(props);
        this.validatePartItem(props);
        this._sku = props.sku;
        this._partName = props.partName;
        this._manufacturer = props.manufacturer;
    }

    static create(props: PartItemProps): PartItem {
        return new PartItem(props);
    }

    private validatePartItem(props: PartItemProps): void {
        if (!props.sku || props.sku.trim() === '') {
            throw new Error('Part SKU is required');
        }
        if (!props.partName || props.partName.trim() === '') {
            throw new Error('Part name is required');
        }
    }

    get type(): OrderItemType {
        return OrderItemType.PART;
    }

    get sku(): string {
        return this._sku;
    }

    get partName(): string {
        return this._partName;
    }

    get manufacturer(): string | undefined {
        return this._manufacturer;
    }

    toJSON() {
        return {
            id: this._id,
            type: this.type,
            sku: this._sku,
            partName: this._partName,
            manufacturer: this._manufacturer,
            description: this._description,
            quantity: this._quantity,
            unitPrice: this._unitPrice.toJSON(),
            discount: this._discount.toJSON(),
            subtotal: this.subtotal.toJSON(),
        };
    }

    static fromJSON(data: any): PartItem {
        return PartItem.create({
            id: data.id,
            sku: data.sku,
            partName: data.partName,
            manufacturer: data.manufacturer,
            description: data.description,
            quantity: data.quantity,
            unitPrice: Money.fromJSON(data.unitPrice),
            discount: data.discount ? Money.fromJSON(data.discount) : undefined,
        });
    }
}
