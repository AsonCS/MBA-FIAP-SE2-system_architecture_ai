import { Money } from '../value-objects';
import { OrderItem, OrderItemProps, OrderItemType } from './order-item.entity';

/**
 * ServiceItem Entity
 * Represents labor/service work in a work order
 */
export interface ServiceItemProps extends OrderItemProps {
    serviceCode: string;
    serviceName: string;
    estimatedHours?: number;
    technicianId?: string;
}

export class ServiceItem extends OrderItem {
    private readonly _serviceCode: string;
    private readonly _serviceName: string;
    private _estimatedHours?: number;
    private _technicianId?: string;

    private constructor(props: ServiceItemProps) {
        super(props);
        this.validateServiceItem(props);
        this._serviceCode = props.serviceCode;
        this._serviceName = props.serviceName;
        this._estimatedHours = props.estimatedHours;
        this._technicianId = props.technicianId;
    }

    static create(props: ServiceItemProps): ServiceItem {
        return new ServiceItem(props);
    }

    private validateServiceItem(props: ServiceItemProps): void {
        if (!props.serviceCode || props.serviceCode.trim() === '') {
            throw new Error('Service code is required');
        }
        if (!props.serviceName || props.serviceName.trim() === '') {
            throw new Error('Service name is required');
        }
        if (props.estimatedHours !== undefined && props.estimatedHours <= 0) {
            throw new Error('Estimated hours must be greater than zero');
        }
    }

    get type(): OrderItemType {
        return OrderItemType.SERVICE;
    }

    get serviceCode(): string {
        return this._serviceCode;
    }

    get serviceName(): string {
        return this._serviceName;
    }

    get estimatedHours(): number | undefined {
        return this._estimatedHours;
    }

    get technicianId(): string | undefined {
        return this._technicianId;
    }

    assignTechnician(technicianId: string): void {
        if (!technicianId || technicianId.trim() === '') {
            throw new Error('Technician ID cannot be empty');
        }
        this._technicianId = technicianId;
    }

    updateEstimatedHours(hours: number): void {
        if (hours <= 0) {
            throw new Error('Estimated hours must be greater than zero');
        }
        this._estimatedHours = hours;
    }

    toJSON() {
        return {
            id: this._id,
            type: this.type,
            serviceCode: this._serviceCode,
            serviceName: this._serviceName,
            description: this._description,
            quantity: this._quantity,
            unitPrice: this._unitPrice.toJSON(),
            discount: this._discount.toJSON(),
            subtotal: this.subtotal.toJSON(),
            estimatedHours: this._estimatedHours,
            technicianId: this._technicianId,
        };
    }

    static fromJSON(data: any): ServiceItem {
        return ServiceItem.create({
            id: data.id,
            serviceCode: data.serviceCode,
            serviceName: data.serviceName,
            description: data.description,
            quantity: data.quantity,
            unitPrice: Money.fromJSON(data.unitPrice),
            discount: data.discount ? Money.fromJSON(data.discount) : undefined,
            estimatedHours: data.estimatedHours,
            technicianId: data.technicianId,
        });
    }
}
