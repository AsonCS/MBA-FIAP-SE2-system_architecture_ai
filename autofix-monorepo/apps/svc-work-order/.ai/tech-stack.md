# Technology Stack - svc-work-order

## 1. Core Frameworks
* **Language:** TypeScript
* **Backend Framework:** NestJS
* **Architecture:** Clean Architecture + DDD

## 2. Persistence & Storage
* **Primary Database:** PostgreSQL
    * Complex relation mapping for O.S. and its items.
    * Uses JSONB for snapshots (`customer`, `vehicle`) to reduce cross-service join complexity.
    * Reliable event publishing using the Outbox Pattern via a dedicated table.

## 3. Communication
* **Asynchronous:** Kafka
    * Publishes: `WorkOrder.Created`, `WorkOrder.StatusChanged`, `WorkOrder.Completed`.
    * Consumes: Relevant events from other services if needed.
* **Synchronous:** REST / gRPC
    * External APIs for real-time inventory checks via Anti-Corruption Layer (ACL).

## 4. Key Libraries
* **ORM:** TypeORM or Prisma.
* **Events:** Kafka-js or NestJS Microservices.
* **Logic:** Custom `Money` VO for high-precision arithmetic.

## 5. Port Interfaces Example
```typescript
export interface IWorkOrderRepository {
  save(workOrder: WorkOrder): Promise<void>;
  findById(id: string): Promise<WorkOrder | null>;
}

export interface IInventoryGateway {
  checkAvailability(sku: string, quantity: number): Promise<boolean>;
  reserveStock(sku: string, quantity: number): Promise<void>;
}
```
