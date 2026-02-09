import { WorkOrder } from '../../../core/domain/aggregates';
import { WorkOrderEntity } from '../entities';
import {
    CustomerSnapshot,
    VehicleSnapshot,
    WorkOrderStatus,
    Money,
} from '../../../core/domain/value-objects';
import { PartItem, ServiceItem, OrderItemType } from '../../../core/domain/entities';

/**
 * WorkOrderMapper
 * Maps between domain model and persistence model
 */
export class WorkOrderMapper {
    /**
     * Maps domain WorkOrder to TypeORM entity
     */
    static toEntity(workOrder: WorkOrder): WorkOrderEntity {
        const json = workOrder.toJSON();

        const entity = new WorkOrderEntity();
        entity.id = json.id;
        entity.tenantId = json.tenantId;
        entity.orderNumber = json.orderNumber;
        entity.customer = json.customer;
        entity.vehicle = json.vehicle;
        entity.status = json.status;
        entity.items = json.items;
        entity.notes = json.notes;
        entity.createdAt = new Date(json.createdAt);
        entity.updatedAt = new Date(json.updatedAt);
        entity.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
        entity.deleted = false;

        return entity;
    }

    /**
     * Maps TypeORM entity to domain WorkOrder
     */
    static toDomain(entity: WorkOrderEntity): WorkOrder {
        const items = entity.items.map((itemData) => {
            if (itemData.type === OrderItemType.PART) {
                return PartItem.create({
                    id: itemData.id,
                    sku: itemData.sku!,
                    partName: itemData.partName!,
                    manufacturer: itemData.manufacturer,
                    description: itemData.description,
                    quantity: itemData.quantity,
                    unitPrice: Money.fromCents(itemData.unitPrice),
                    discount: Money.fromCents(itemData.discount),
                });
            } else {
                return ServiceItem.create({
                    id: itemData.id,
                    serviceCode: itemData.serviceCode!,
                    serviceName: itemData.serviceName!,
                    description: itemData.description,
                    quantity: itemData.quantity,
                    unitPrice: Money.fromCents(itemData.unitPrice),
                    discount: Money.fromCents(itemData.discount),
                    estimatedHours: itemData.estimatedHours,
                    technicianId: itemData.technicianId,
                });
            }
        });

        return WorkOrder.reconstitute({
            id: entity.id,
            tenantId: entity.tenantId,
            orderNumber: entity.orderNumber,
            customer: CustomerSnapshot.fromJSON(entity.customer),
            vehicle: VehicleSnapshot.fromJSON(entity.vehicle),
            status: WorkOrderStatus.fromString(entity.status),
            items,
            notes: entity.notes,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            completedAt: entity.completedAt,
        });
    }
}
