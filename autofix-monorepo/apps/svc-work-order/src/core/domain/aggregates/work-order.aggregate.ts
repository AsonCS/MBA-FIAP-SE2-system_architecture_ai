import {
    Money,
    WorkOrderStatus,
    VehicleSnapshot,
    CustomerSnapshot,
} from '../value-objects';
import { OrderItem, PartItem, ServiceItem, OrderItemType } from '../entities';
import {
    DomainEvent,
    WorkOrderCreatedEvent,
    ItemAddedEvent,
    WorkOrderStatusChangedEvent,
    WorkOrderCompletedEvent,
} from '../events';
import {
    InvalidStatusTransitionException,
    ItemNotFoundException,
    WorkOrderAlreadyFinalizedException,
    InvalidOperationException,
} from '../exceptions';

/**
 * WorkOrder Aggregate Root
 * Manages the complete lifecycle of a work order with transactional consistency
 */
export interface WorkOrderProps {
    id: string;
    tenantId: string;
    orderNumber: string;
    customer: CustomerSnapshot;
    vehicle: VehicleSnapshot;
    status: WorkOrderStatus;
    items: OrderItem[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export class WorkOrder {
    private readonly _id: string;
    private readonly _tenantId: string;
    private readonly _orderNumber: string;
    private readonly _customer: CustomerSnapshot;
    private readonly _vehicle: VehicleSnapshot;
    private _status: WorkOrderStatus;
    private _items: OrderItem[];
    private _notes?: string;
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private _completedAt?: Date;
    private _domainEvents: DomainEvent[] = [];

    private constructor(props: WorkOrderProps) {
        this.validate(props);
        this._id = props.id;
        this._tenantId = props.tenantId;
        this._orderNumber = props.orderNumber;
        this._customer = props.customer;
        this._vehicle = props.vehicle;
        this._status = props.status;
        this._items = props.items;
        this._notes = props.notes;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._completedAt = props.completedAt;
    }

    static create(
        id: string,
        tenantId: string,
        orderNumber: string,
        customer: CustomerSnapshot,
        vehicle: VehicleSnapshot,
        notes?: string,
    ): WorkOrder {
        const workOrder = new WorkOrder({
            id,
            tenantId,
            orderNumber,
            customer,
            vehicle,
            status: WorkOrderStatus.draft(),
            items: [],
            notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        workOrder.addDomainEvent(
            new WorkOrderCreatedEvent(
                id,
                tenantId,
                customer.customerId,
                vehicle.vehicleId,
            ),
        );

        return workOrder;
    }

    static reconstitute(props: WorkOrderProps): WorkOrder {
        return new WorkOrder(props);
    }

    private validate(props: WorkOrderProps): void {
        if (!props.id || props.id.trim() === '') {
            throw new Error('Work order ID is required');
        }
        if (!props.tenantId || props.tenantId.trim() === '') {
            throw new Error('Tenant ID is required');
        }
        if (!props.orderNumber || props.orderNumber.trim() === '') {
            throw new Error('Order number is required');
        }
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get tenantId(): string {
        return this._tenantId;
    }

    get orderNumber(): string {
        return this._orderNumber;
    }

    get customer(): CustomerSnapshot {
        return this._customer;
    }

    get vehicle(): VehicleSnapshot {
        return this._vehicle;
    }

    get status(): WorkOrderStatus {
        return this._status;
    }

    get items(): ReadonlyArray<OrderItem> {
        return [...this._items];
    }

    get notes(): string | undefined {
        return this._notes;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get completedAt(): Date | undefined {
        return this._completedAt;
    }

    get domainEvents(): ReadonlyArray<DomainEvent> {
        return [...this._domainEvents];
    }

    /**
     * Calculates total for parts only
     */
    get totalParts(): Money {
        return this._items
            .filter((item) => item.type === OrderItemType.PART)
            .reduce((total, item) => total.add(item.subtotal), Money.zero());
    }

    /**
     * Calculates total for services/labor only
     */
    get totalLabor(): Money {
        return this._items
            .filter((item) => item.type === OrderItemType.SERVICE)
            .reduce((total, item) => total.add(item.subtotal), Money.zero());
    }

    /**
     * Calculates grand total (parts + labor)
     */
    get totalAmount(): Money {
        return this.totalParts.add(this.totalLabor);
    }

    // Business Methods

    /**
     * Adds an item to the work order
     * Automatically recalculates totals
     */
    addItem(item: OrderItem): void {
        this.ensureNotFinalized();

        this._items.push(item);
        this._updatedAt = new Date();

        this.addDomainEvent(
            new ItemAddedEvent(
                this._id,
                item.id,
                item.type,
                item.description,
            ),
        );
    }

    /**
     * Removes an item from the work order
     */
    removeItem(itemId: string): void {
        this.ensureNotFinalized();

        const index = this._items.findIndex((item) => item.id === itemId);
        if (index === -1) {
            throw new ItemNotFoundException(itemId);
        }

        this._items.splice(index, 1);
        this._updatedAt = new Date();
    }

    /**
     * Finds an item by ID
     */
    findItem(itemId: string): OrderItem | undefined {
        return this._items.find((item) => item.id === itemId);
    }

    /**
     * Updates work order notes
     */
    updateNotes(notes: string): void {
        this.ensureNotFinalized();
        this._notes = notes;
        this._updatedAt = new Date();
    }

    /**
     * Changes work order status with validation
     */
    changeStatus(newStatus: WorkOrderStatus): void {
        if (this._status.equals(newStatus)) {
            return; // No change needed
        }

        if (!this._status.canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(
                this._status.toString(),
                newStatus.toString(),
            );
        }

        const previousStatus = this._status;
        this._status = newStatus;
        this._updatedAt = new Date();

        this.addDomainEvent(
            new WorkOrderStatusChangedEvent(
                this._id,
                previousStatus.toString(),
                newStatus.toString(),
                this._tenantId,
            ),
        );

        // If transitioning to completed, set completion date
        if (newStatus.isCompleted()) {
            this._completedAt = new Date();
        }
    }

    /**
     * Submits work order for approval
     */
    submitForApproval(): void {
        if (this._items.length === 0) {
            throw new InvalidOperationException(
                'submitForApproval',
                'Cannot submit work order without items',
            );
        }
        this.changeStatus(WorkOrderStatus.pendingApproval());
    }

    /**
     * Approves the work order
     */
    approve(): void {
        this.changeStatus(WorkOrderStatus.approved());
    }

    /**
     * Starts work on the order
     */
    startWork(): void {
        this.changeStatus(WorkOrderStatus.inProgress());
    }

    /**
     * Completes the work order
     * Triggers inventory deduction event
     */
    complete(): void {
        if (this._items.length === 0) {
            throw new InvalidOperationException(
                'complete',
                'Cannot complete work order without items',
            );
        }

        this.changeStatus(WorkOrderStatus.completed());

        // Prepare items for the event
        const eventItems = this._items.map((item) => ({
            itemId: item.id,
            type: item.type,
            sku: item instanceof PartItem ? item.sku : undefined,
            quantity: item.quantity,
        }));

        this.addDomainEvent(
            new WorkOrderCompletedEvent(
                this._id,
                this._tenantId,
                this.totalAmount.cents,
                eventItems,
            ),
        );
    }

    /**
     * Cancels the work order
     */
    cancel(): void {
        this.changeStatus(WorkOrderStatus.canceled());
    }

    /**
     * Ensures the work order is not in a final state
     */
    private ensureNotFinalized(): void {
        if (this._status.isFinal()) {
            throw new WorkOrderAlreadyFinalizedException(this._id);
        }
    }

    /**
     * Adds a domain event
     */
    private addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    /**
     * Clears all domain events
     */
    clearDomainEvents(): void {
        this._domainEvents = [];
    }

    /**
     * Serializes to JSON
     */
    toJSON() {
        return {
            id: this._id,
            tenantId: this._tenantId,
            orderNumber: this._orderNumber,
            customer: this._customer.toJSON(),
            vehicle: this._vehicle.toJSON(),
            status: this._status.toJSON(),
            items: this._items.map((item) => item.toJSON()),
            notes: this._notes,
            totalParts: this.totalParts.toJSON(),
            totalLabor: this.totalLabor.toJSON(),
            totalAmount: this.totalAmount.toJSON(),
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
            completedAt: this._completedAt?.toISOString(),
        };
    }

    /**
     * Deserializes from JSON
     */
    static fromJSON(data: any): WorkOrder {
        const items: OrderItem[] = data.items.map((itemData: any) => {
            if (itemData.type === OrderItemType.PART) {
                return PartItem.fromJSON(itemData);
            } else {
                return ServiceItem.fromJSON(itemData);
            }
        });

        return WorkOrder.reconstitute({
            id: data.id,
            tenantId: data.tenantId,
            orderNumber: data.orderNumber,
            customer: CustomerSnapshot.fromJSON(data.customer),
            vehicle: VehicleSnapshot.fromJSON(data.vehicle),
            status: WorkOrderStatus.fromString(data.status),
            items,
            notes: data.notes,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        });
    }
}
